import {
  and,
  desc,
  eq,
  inArray,
  isNull,
  lt,
  notInArray,
  schema,
} from '@cs/database';
import { TicketLabelsChanged, TicketTimelineEntryType } from '@cs/kyaku/models';
import { FindConfig, GetConfig } from '@cs/kyaku/types/query';
import { KyakuError } from '@cs/kyaku/utils';

import { LabelSort, LabelWith } from '../entities/label';
import LabelRepository from '../repositories/label';
import LabelTypeRepository from '../repositories/label-type';
import TicketRepository from '../repositories/ticket';
import TicketTimelineRepository from '../repositories/ticket-timeline';
import { UnitOfWork } from '../unit-of-work';
import { BaseService } from './base-service';
import { InclusionFilterOperator } from './build-query';

export default class LabelService extends BaseService {
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
    const label = await this.labelRepository.find({
      where: eq(schema.labels.id, labelId),
      with: this.getWithClause(config?.relations),
    });

    if (!label)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Label with id:${labelId} not found`
      );

    return label;
  }

  async list<T extends LabelWith<T>>(
    filters: {
      id?: InclusionFilterOperator<string>;
      ticketId?: string;
      labelTypeId?: string;
    },
    config?: FindConfig<T, LabelSort>
  ) {
    const whereClause = and(
      filters.id
        ? 'in' in filters.id
          ? inArray(schema.labels.id, filters.id.in)
          : 'notIn' in filters.id
            ? notInArray(schema.labels.id, filters.id.notIn)
            : undefined
        : undefined,
      filters.ticketId
        ? eq(schema.labels.ticketId, filters.ticketId)
        : undefined,
      filters.labelTypeId
        ? eq(schema.labels.labelTypeId, filters.labelTypeId)
        : undefined,
      config?.skip ? lt(schema.labels.id, config.skip) : undefined
    );
    return await this.labelRepository.findMany({
      where: whereClause,
      with: this.getWithClause(config?.relations),
      limit: config?.take,
      orderBy: and(config?.skip ? desc(schema.tickets.id) : undefined),
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
        `Ticket with id:${ticketId} not found`
      );

    const ticketLabelTypes = ticket.labels.flatMap(
      (label) => label.labelType.id
    );

    const duplicatedLabelTypeIds = labelTypeIds.filter((labelTypeId) =>
      ticketLabelTypes.includes(labelTypeId)
    );

    if (duplicatedLabelTypeIds.length > 0)
      throw new KyakuError(
        KyakuError.Types.DUPLICATE_ERROR,
        `Label types with ids: ${duplicatedLabelTypeIds.join(',')} already added to ticket`
      );

    const fetchedLabelTypes = await this.labelTypeRepository.findMany({
      where: inArray(schema.labelTypes.id, labelTypeIds),
    });
    const fetchedLabelTypeIds = fetchedLabelTypes.map(
      (labelType) => labelType.id
    );

    const missingLabelTypeIds = labelTypeIds.filter(
      (labelTypeId) => !fetchedLabelTypeIds.includes(labelTypeId)
    );

    if (missingLabelTypeIds.length > 0)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Label types with ids: ${missingLabelTypeIds.join(',')} not found`
      );

    return await this.unitOfWork.transaction(async (tx) => {
      const newLabels = await this.labelRepository.createMany(
        labelTypeIds.map((labelTypeId) => ({
          ticketId: ticket.id,
          labelTypeId: labelTypeId,
        })),
        tx
      );

      if (!newLabels) {
        tx.rollback();
        return;
      }

      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticket.id,
          updatedAt: new Date(),
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
          type: TicketTimelineEntryType.LabelsChanged,
          entry: {
            oldLabelIds: [],
            newLabelIds: newLabels.map((label) => label.id),
          } satisfies TicketLabelsChanged,
          customerId: ticket.customerId,
          createdAt: updatedTicket.updatedAt ?? new Date(),
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
        `Ticket with id:${ticketId} not found`
      );

    const fetchedLabels = await this.labelRepository.findMany({
      where: inArray(schema.labelTypes.id, labelIds),
    });
    const fetchedLabelIds = fetchedLabels.map((label) => label.id);

    const missingLabelIds = labelIds.filter(
      (labelId) => !fetchedLabelIds.includes(labelId)
    );
    if (missingLabelIds.length > 0)
      throw new KyakuError(
        KyakuError.Types.NOT_FOUND,
        `Labels with ids: ${missingLabelIds.join(',')} not found`
      );

    return await this.unitOfWork.transaction(async (tx) => {
      const archivedDate = new Date();
      const archivedLabels = await this.labelRepository.updateMany(
        labelIds,
        {
          archivedAt: archivedDate,
        },
        tx
      );

      const updatedTicket = await this.ticketRepository.update(
        {
          id: ticketId,
          updatedAt: archivedDate,
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
          type: TicketTimelineEntryType.LabelsChanged,
          entry: {
            oldLabelIds: archivedLabels.map((label) => label.id),
            newLabelIds: [],
          } satisfies TicketLabelsChanged,
          customerId: ticket.customerId,
          createdAt: updatedTicket.updatedAt ?? new Date(),
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
}
