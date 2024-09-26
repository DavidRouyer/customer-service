import { and, eq, inArray, isNotNull, isNull, schema } from '@kyaku/database';
import type {
  LabelRepository,
  LabelTypeRepository,
  TicketRepository,
  TicketTimelineRepository,
} from '@kyaku/database';
import type { TicketLabelsChanged } from '@kyaku/kyaku/models';
import { TimelineEntryType } from '@kyaku/kyaku/models';
import type { FindConfig, GetConfig } from '@kyaku/kyaku/types';
import { Direction } from '@kyaku/kyaku/types';
import { KyakuError } from '@kyaku/kyaku/utils';

import {
  filterByDirection,
  inclusionFilterOperator,
  sortByDirection,
} from '../../../../database/build-query';
import type { UnitOfWork } from '../../unit-of-work';
import { BaseService } from '../base-service';
import type { LabelFilters, LabelWith } from './common';
import { LabelSortField } from './common';

export class LabelService extends BaseService {
  private readonly labelRepository: LabelRepository;
  private readonly labelTypeRepository: LabelTypeRepository;
  private readonly ticketRepository: TicketRepository;
  private readonly ticketTimelineRepository: TicketTimelineRepository;

  constructor({
    labelRepository,
    labelTypeRepository,
    ticketRepository,
    ticketTimelineRepository,
  }: {
    labelRepository: LabelRepository;
    labelTypeRepository: LabelTypeRepository;
    ticketRepository: TicketRepository;
    ticketTimelineRepository: TicketTimelineRepository;
  } & { unitOfWork: UnitOfWork }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.labelRepository = labelRepository;
    this.labelTypeRepository = labelTypeRepository;
    this.ticketRepository = ticketRepository;
    this.ticketTimelineRepository = ticketTimelineRepository;
  }

  async retrieve<T extends LabelWith<T>>(
    labelId: string,
    config?: GetConfig<T>
  ) {
    return await this.labelRepository.find({
      where: eq(schema.labels.id, labelId),
      with: this.getWithClause(config?.relations),
    });
  }

  async list<T extends LabelWith<T>>(
    filters: LabelFilters = {},
    config: FindConfig<T, LabelSortField> = {
      direction: Direction.Forward,
      limit: 50,
      sortBy: LabelSortField.id,
    }
  ) {
    return await this.labelRepository.findMany({
      limit: config.limit,
      orderBy: [sortByDirection(config.direction)(schema.labelTypes.id)],
      where: and(
        this.getFilterWhereClause(filters),
        this.getIdWhereClause(config)
      ),
      with: this.getWithClause(config.relations),
    });
  }

  async addLabels(ticketId: string, labelTypeIds: string[], userId: string) {
    const ticket = await this.ticketRepository.find({
      columns: {
        id: true,
        customerId: true,
      },
      where: eq(schema.tickets.id, ticketId),
      with: {
        labels: {
          with: {
            labelType: true,
          },
          where: isNull(schema.labels.archivedAt),
        },
      },
    });

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`,
        ['id']
      );

    const affectedLabelTypeIds = new Set(
      ticket.labels.flatMap((label) => label.labelType.id)
    );

    const nonAffectedLabelTypeIds = labelTypeIds.filter(
      (labelTypeId) => !affectedLabelTypeIds.has(labelTypeId)
    );

    const fetchedLabelTypes = await this.labelTypeRepository.findMany({
      where: inArray(schema.labelTypes.id, labelTypeIds),
    });
    const fetchedLabelTypeIds = new Set(
      fetchedLabelTypes.map((labelType) => labelType.id)
    );

    const validLabelTypeIds = nonAffectedLabelTypeIds.filter((labelTypeId) =>
      fetchedLabelTypeIds.has(labelTypeId)
    );

    if (!validLabelTypeIds.length) return [];

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      const newLabels = await this.labelRepository.createMany(
        validLabelTypeIds.map((labelTypeId) => ({
          ticketId: ticket.id,
          labelTypeId: labelTypeId,
        })),
        tx
      );

      if (!newLabels.length) {
        tx.rollback();
        return;
      }

      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticket.id,
          updatedAt: updatedAt,
          updatedById: userId,
        },
        tx
      );

      if (!updatedTicket) {
        tx.rollback();
        return;
      }

      await this.ticketTimelineRepository.create(
        {
          ticketId: ticket.id,
          type: TimelineEntryType.LabelsChanged,
          entry: {
            oldLabelIds: [],
            newLabelIds: newLabels.map((label) => label.id),
          } satisfies TicketLabelsChanged,
          customerId: ticket.customerId,
          createdAt: updatedTicket.updatedAt ?? updatedAt,
          userCreatedById: userId,
        },
        tx
      );

      return newLabels;
    });
  }

  async removeLabels(ticketId: string, labelIds: string[], userId: string) {
    const ticket = await this.ticketRepository.find({
      columns: {
        id: true,
        customerId: true,
      },
      where: eq(schema.tickets.id, ticketId),
    });

    if (!ticket)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Ticket with id:${ticketId} not found`,
        ['id']
      );

    const fetchedLabels = await this.labelRepository.findMany({
      where: inArray(schema.labelTypes.id, labelIds),
    });
    const fetchedLabelIds = new Set(fetchedLabels.map((label) => label.id));

    const validLabelIds = labelIds.filter((labelId) =>
      fetchedLabelIds.has(labelId)
    );

    if (!validLabelIds.length) return;

    return await this.unitOfWork.transaction(async (tx) => {
      const updatedAt = new Date();

      const archivedLabels = await this.labelRepository.updateMany(
        validLabelIds,
        {
          archivedAt: updatedAt,
        },
        tx
      );

      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          updatedAt: updatedAt,
          updatedById: userId,
        },
        tx
      );

      if (!updatedTicket) {
        tx.rollback();
        return;
      }

      await this.ticketTimelineRepository.create(
        {
          ticketId: ticketId,
          type: TimelineEntryType.LabelsChanged,
          entry: {
            oldLabelIds: archivedLabels.map((label) => label.id),
            newLabelIds: [],
          } satisfies TicketLabelsChanged,
          customerId: ticket.customerId,
          createdAt: updatedTicket.updatedAt ?? updatedAt,
          userCreatedById: userId,
        },
        tx
      );
    });
  }

  private getWithClause<T extends LabelWith<T>>(
    relations: T | undefined
  ): {
    ticket: T extends { ticket: true } ? true : undefined;
    labelType: T extends { labelType: true } ? true : undefined;
  } {
    return {
      ticket: (relations?.ticket ? true : undefined) as T extends {
        ticket: true;
      }
        ? true
        : undefined,
      labelType: (relations?.labelType ? true : undefined) as T extends {
        labelType: true;
      }
        ? true
        : undefined,
    };
  }

  private getFilterWhereClause(filters: LabelFilters) {
    if (!Object.keys(filters).length) return undefined;

    return and(
      filters.ticketId
        ? eq(schema.labels.ticketId, filters.ticketId)
        : undefined,
      filters.labelIds
        ? inclusionFilterOperator(schema.labels.id, filters.labelIds)
        : undefined,
      filters.isArchived !== undefined
        ? filters.isArchived
          ? isNotNull(schema.labels.archivedAt)
          : isNull(schema.labels.archivedAt)
        : undefined
    );
  }

  private getIdWhereClause<T extends LabelWith<T>>(
    config: FindConfig<T, LabelSortField>
  ) {
    if (!config.cursor?.lastId) return undefined;

    return filterByDirection(config.direction)(
      schema.labelTypes.id,
      config.cursor.lastId
    );
  }
}
