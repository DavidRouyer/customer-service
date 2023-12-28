import { and, desc, eq, inArray, lt, notInArray, schema } from '@cs/database';
import {
  TicketLabelsChanged,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';

import { WithConfig } from '../entities/common';
import { LabelRelations, LabelSort } from '../entities/label';
import KyakuError from '../kyaku-error';
import { BaseService } from './base-service';
import { InclusionFilterOperator } from './build-query';
import LabelTypeService from './label-type';
import TicketService from './ticket';

export default class LabelService extends BaseService {
  private readonly labelTypeService: LabelTypeService;
  private readonly ticketService: TicketService;

  constructor({
    labelTypeService,
    ticketService,
  }: {
    labelTypeService: LabelTypeService;
    ticketService: TicketService;
  }) {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
    this.labelTypeService = labelTypeService;
    this.ticketService = ticketService;
  }

  async retrieve<T extends LabelRelations>(
    labelId: string,
    config: WithConfig<T, LabelSort> = { relations: {} as T }
  ) {
    const label = await this.dataSource.query.labels.findFirst({
      where: eq(schema.labels.id, labelId),
      with: config.relations,
    });

    if (!label)
      throw new KyakuError('NOT_FOUND', `Label with id:${labelId} not found`);

    return label;
  }

  async list<T extends LabelRelations>(
    filters: {
      id?: InclusionFilterOperator<string>;
      ticketId?: string;
      labelTypeId?: string;
    },
    config: WithConfig<T, LabelSort> = {
      relations: {} as T,
    }
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
      config.skip ? lt(schema.labels.id, config.skip) : undefined
    );
    return await this.dataSource.query.labels.findMany({
      where: whereClause,
      with: config.relations,
      limit: config.take,
      orderBy: and(config.skip ? desc(schema.tickets.id) : undefined),
    });
  }

  async addLabels(ticketId: string, labelTypeIds: string[], userId: string) {
    const ticket = await this.ticketService.retrieve(ticketId);

    const fetchedLabelTypes = await this.labelTypeService.list({
      id: {
        in: labelTypeIds,
      },
    });
    const fetchedLabelTypeIds = fetchedLabelTypes.map(
      (labelType) => labelType.id
    );

    const missingLabelTypeIds = labelTypeIds.filter(
      (labelTypeId) => !fetchedLabelTypeIds.includes(labelTypeId)
    );

    if (missingLabelTypeIds.length > 0)
      throw new KyakuError(
        'NOT_FOUND',
        `Label types with ids: ${missingLabelTypeIds.join(',')} not found`
      );

    return await this.dataSource.transaction(async (tx) => {
      const newLabels = await tx
        .insert(schema.labels)
        .values(
          labelTypeIds.map((labelTypeId) => ({
            ticketId: ticket.id,
            labelTypeId: labelTypeId,
          }))
        )
        .returning({ labelId: schema.labels.id });

      const updatedTicket = await tx
        .update(schema.tickets)
        .set({
          updatedAt: new Date(),
          updatedById: userId,
        })
        .where(eq(schema.tickets.id, ticket.id))
        .returning({
          id: schema.tickets.id,
          updatedAt: schema.tickets.updatedAt,
        })
        .then((res) => res[0]);

      if (!updatedTicket) {
        tx.rollback();
        return;
      }

      await tx.insert(schema.ticketTimelineEntries).values({
        ticketId: ticket.id,
        type: TicketTimelineEntryType.LabelsChanged,
        entry: {
          oldLabelIds: [],
          newLabelIds: newLabels.map((label) => label.labelId),
        } satisfies TicketLabelsChanged,
        customerId: ticket.customerId,
        createdAt: updatedTicket.updatedAt ?? new Date(),
        userCreatedById: userId,
      });
    });
  }

  async removeLabels(ticketId: string, labelIds: string[], userId: string) {
    const ticket = await this.ticketService.retrieve(ticketId);

    const fetchedLabels = await this.dataSource.query.labels.findMany({
      where: inArray(schema.labelTypes.id, labelIds),
    });
    const fetchedLabelIds = fetchedLabels.map((label) => label.id);

    const missingLabelIds = labelIds.filter(
      (labelId) => !fetchedLabelIds.includes(labelId)
    );
    if (missingLabelIds.length > 0)
      throw new KyakuError(
        'NOT_FOUND',
        `Labels with ids: ${missingLabelIds.join(',')} not found`
      );

    return await this.dataSource.transaction(async (tx) => {
      const deletedLabels = await tx
        .delete(schema.labels)
        .where(
          and(
            eq(schema.labels.ticketId, ticketId),
            inArray(schema.labels.id, labelIds)
          )
        )
        .returning({ labelId: schema.labels.id });

      const updatedTicket = await tx
        .update(schema.tickets)
        .set({
          updatedAt: new Date(),
          updatedById: userId,
        })
        .where(eq(schema.tickets.id, ticketId))
        .returning({
          id: schema.tickets.id,
          updatedAt: schema.tickets.updatedAt,
        })
        .then((res) => res[0]);

      if (!updatedTicket) {
        tx.rollback();
        return;
      }

      await tx.insert(schema.ticketTimelineEntries).values({
        ticketId: ticketId,
        type: TicketTimelineEntryType.LabelsChanged,
        entry: {
          oldLabelIds: deletedLabels.map((label) => label.labelId),
          newLabelIds: [],
        } satisfies TicketLabelsChanged,
        customerId: ticket.customerId,
        createdAt: updatedTicket.updatedAt ?? new Date(),
        userCreatedById: userId,
      });
    });
  }
}
