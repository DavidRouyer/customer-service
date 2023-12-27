import { and, DataSource, eq, inArray, schema } from '@cs/database';
import {
  TicketLabelsChanged,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';

import { LabelRelations, LabelSort } from '../entities/label';
import { WithConfig } from '../entities/ticket';
import KyakuError from '../kyaku-error';
import TicketService from './ticket';

export default class LabelService {
  private readonly dataSource: DataSource;
  private readonly ticketService: TicketService;

  constructor({
    dataSource,
    ticketService,
  }: {
    dataSource: DataSource;
    ticketService: TicketService;
  }) {
    this.dataSource = dataSource;
    this.ticketService = ticketService;
  }

  async retrieve(
    labelId: string,
    config: WithConfig<LabelRelations, LabelSort> = { relations: {} }
  ) {
    const label = await this.dataSource.query.labels.findFirst({
      where: eq(schema.labels.id, labelId),
      with: config.relations,
    });

    if (!label)
      throw new KyakuError('NOT_FOUND', `Label with id:${labelId} not found`);

    return label;
  }

  async addLabels(ticketId: string, labelTypeIds: string[], userId: string) {
    const ticket = await this.ticketService.retrieve(ticketId);

    const labelTypes = await this.dataSource.query.labelTypes.findMany({
      where: inArray(schema.labelTypes.id, labelTypeIds),
    });

    const missingLabelTypes: string[] = [];
    for (const labelTypeId of labelTypeIds) {
      if (!labelTypes.find((labelType) => labelType.id === labelTypeId)) {
        missingLabelTypes.push(labelTypeId);
      }
    }
    if (missingLabelTypes.length > 0)
      throw new KyakuError(
        'NOT_FOUND',
        'Label types with ids: ' + missingLabelTypes.join(',') + ' not found'
      );

    return await this.dataSource.transaction(async (tx) => {
      const newLabels = await tx
        .insert(schema.labels)
        .values(
          labelTypes.map((labelType) => ({
            ticketId: ticket.id,
            labelTypeId: labelType.id,
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

    const labels = await this.dataSource.query.labels.findMany({
      where: inArray(schema.labelTypes.id, labelIds),
    });

    const missingLabels: string[] = [];
    for (const labelId of labelIds) {
      if (!labels.find((label) => label.id === labelId)) {
        missingLabels.push(labelId);
      }
    }
    if (missingLabels.length > 0)
      throw new KyakuError(
        'NOT_FOUND',
        'Labels with ids: ' + missingLabels.join(',') + ' not found'
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
