import {
  and,
  asc,
  Column,
  DataSource,
  desc,
  eq,
  GetColumnData,
  gt,
  gte,
  inArray,
  isNull,
  lt,
  lte,
  notInArray,
  schema,
} from '@cs/database';
import { extractMentions } from '@cs/lib/editor';
import {
  TicketPriority,
  TicketStatus,
  TicketStatusDetail,
} from '@cs/lib/tickets';
import {
  TicketAssignmentChanged,
  TicketChat,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';

import {
  InclusionFilterOperator,
  QuantityFilterOperator,
  SortDirection,
  Ticket,
  TicketRelations,
  TicketSort,
  WithConfig,
} from '../entities/ticket';
import KyakuError from '../kyaku-error';

export default class TicketService {
  private readonly dataSource: DataSource;

  constructor({ dataSource }: { dataSource: DataSource }) {
    this.dataSource = dataSource;
  }

  async retrieve(
    ticketId: string,
    config: WithConfig<TicketRelations, TicketSort> = { relations: {} }
  ) {
    const ticket = await this.dataSource.query.tickets.findFirst({
      where: eq(schema.tickets.id, ticketId),
      with: config.relations,
    });

    if (!ticket)
      throw new KyakuError('NOT_FOUND', `Ticket with id:${ticketId} not found`);

    return ticket;
  }

  async list(
    filters: {
      assignedToId?: NonNullable<Ticket['assignedToId']>[] | null;
      createdAt?: QuantityFilterOperator<Ticket['createdAt']>;
      customerId?: Ticket['customerId'];
      id?: InclusionFilterOperator<Ticket['id']>;
      status?: Ticket['status'];
    },
    config: WithConfig<TicketRelations, TicketSort> = { relations: {} }
  ) {
    const whereClause = and(
      filters.assignedToId !== undefined
        ? filters.assignedToId !== null
          ? inArray(schema.tickets.assignedToId, filters.assignedToId)
          : isNull(schema.tickets.assignedToId)
        : undefined,
      filters.customerId
        ? eq(schema.tickets.customerId, filters.customerId)
        : undefined,
      filters.createdAt
        ? quantityFilterOperator(schema.tickets.createdAt, filters.createdAt)
        : undefined,
      filters.id
        ? inclusionFilterOperator(schema.tickets.id, filters.id)
        : undefined,
      filters.status ? eq(schema.tickets.status, filters.status) : undefined,
      config.skip ? lt(schema.tickets.id, config.skip) : undefined
    );
    return await this.dataSource.query.tickets.findMany({
      where: whereClause,
      with: config.relations,
      limit: config.take,
      orderBy: and(
        config.sortBy
          ? 'priority' in config.sortBy
            ? sortDirection(config.sortBy.priority)(schema.tickets.priority)
            : 'createdAt' in config.sortBy
              ? sortDirection(config.sortBy.createdAt)(schema.tickets.createdAt)
              : undefined
          : undefined,
        config.skip ? desc(schema.tickets.id) : undefined
      ),
    });
  }

  async create(
    data: Omit<
      Ticket,
      | 'id'
      | 'assignedToId'
      | 'status'
      | 'statusDetail'
      | 'statusChangedAt'
      | 'createdAt'
      | 'updatedById'
      | 'updatedAt'
    >
  ) {
    await this.dataSource.transaction(async (tx) => {
      const creationDate = new Date();

      const newTicket = await tx
        .insert(schema.tickets)
        .values({
          ...data,
          status: TicketStatus.Open,
          statusDetail: TicketStatusDetail.Created,
          statusChangedAt: creationDate,
          createdAt: creationDate,
        })
        .returning({
          id: schema.tickets.id,
        })
        .then((res) => res[0]);

      if (!newTicket) {
        tx.rollback();
        return;
      }

      return {
        id: newTicket.id,
      };
    });
  }

  async assign(ticketId: string, assignedToId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    return await this.dataSource.transaction(async (tx) => {
      const updatedTicket = await tx
        .update(schema.tickets)
        .set({
          assignedToId: assignedToId,
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
        customerId: ticket.customerId,
        type: TicketTimelineEntryType.AssignmentChanged,
        entry: {
          oldAssignedToId: ticket.assignedToId,
          newAssignedToId: assignedToId,
        } satisfies TicketAssignmentChanged,
        createdAt: updatedTicket.updatedAt ?? new Date(),
        userCreatedById: userId,
      });
    });
  }

  async unassign(ticketId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    if (!ticket.assignedToId)
      throw new KyakuError(
        'NOT_ALLOWED',
        `Ticket with id:${ticketId} is not assigned`
      );

    return await this.dataSource.transaction(async (tx) => {
      const updatedTicket = await tx
        .update(schema.tickets)
        .set({
          assignedToId: null,
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
        customerId: ticket.customerId,
        type: TicketTimelineEntryType.AssignmentChanged,
        entry: {
          oldAssignedToId: ticket.assignedToId,
          newAssignedToId: null,
        } satisfies TicketAssignmentChanged,
        createdAt: updatedTicket.updatedAt ?? new Date(),
        userCreatedById: userId,
      });
    });
  }

  async changePriority(
    ticketId: string,
    priority: TicketPriority,
    userId: string
  ) {
    const ticket = await this.retrieve(ticketId);

    return await this.dataSource.transaction(async (tx) => {
      const updatedTicket = await tx
        .update(schema.tickets)
        .set({
          priority: priority,
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
        customerId: ticket.customerId,
        type: TicketTimelineEntryType.PriorityChanged,
        entry: {
          oldPriority: ticket.priority,
          newPriority: priority,
        } satisfies TicketPriorityChanged,
        createdAt: updatedTicket.updatedAt ?? new Date(),
        userCreatedById: userId,
      });
    });
  }

  async markAsDone(ticketId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    if (ticket.status === TicketStatus.Done)
      throw new KyakuError(
        'NOT_ALLOWED',
        `Ticket with id:${ticketId} is already marked as done`
      );

    return await this.dataSource.transaction(async (tx) => {
      const updatedTicket = await tx
        .update(schema.tickets)
        .set({
          status: TicketStatus.Done,
          statusDetail: null,
          statusChangedAt: new Date(),
          statusChangedById: userId,
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
        customerId: ticket.customerId,
        type: TicketTimelineEntryType.StatusChanged,
        entry: {
          oldStatus: ticket.status,
          newStatus: TicketStatus.Done,
        } satisfies TicketStatusChanged,
        createdAt: updatedTicket.updatedAt ?? new Date(),
        userCreatedById: userId,
      });
    });
  }

  async markAsOpen(ticketId: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    if (ticket.status === TicketStatus.Open)
      throw new KyakuError(
        'NOT_ALLOWED',
        `Ticket with id:${ticketId} is already marked as open`
      );

    return await this.dataSource.transaction(async (tx) => {
      const updatedTicket = await tx
        .update(schema.tickets)
        .set({
          status: TicketStatus.Open,
          statusDetail: null,
          statusChangedAt: new Date(),
          statusChangedById: userId,
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
        customerId: ticket.customerId,
        type: TicketTimelineEntryType.StatusChanged,
        entry: {
          oldStatus: ticket.status,
          newStatus: TicketStatus.Open,
        } satisfies TicketStatusChanged,
        createdAt: updatedTicket.updatedAt ?? new Date(),
        userCreatedById: userId,
      });
    });
  }

  async sendChat(ticketId: string, text: string, userId: string) {
    const ticket = await this.retrieve(ticketId);

    return await this.dataSource.transaction(async (tx) => {
      const creationDate = new Date();

      const newChat = await tx
        .insert(schema.ticketTimelineEntries)
        .values({
          ticketId: ticketId,
          type: TicketTimelineEntryType.Chat,
          entry: {
            text: text,
          } satisfies TicketChat,
          customerId: ticket.customerId,
          createdAt: creationDate,
          userCreatedById: userId,
        })
        .returning({
          id: schema.ticketTimelineEntries.id,
          createdAt: schema.ticketTimelineEntries.createdAt,
        })
        .then((res) => res[0]);

      if (!newChat) {
        tx.rollback();
        return;
      }

      await tx
        .update(schema.tickets)
        .set({
          statusDetail: TicketStatusDetail.Replied,
          statusChangedAt: newChat.createdAt,
          statusChangedById: userId,
          updatedAt: newChat.createdAt,
          updatedById: userId,
        })
        .where(eq(schema.tickets.id, ticketId));

      return {
        id: newChat.id,
      };
    });
  }

  async sendNote(
    ticketId: string,
    text: string,
    rawContent: string,
    userId: string
  ) {
    const ticket = await this.retrieve(ticketId);

    const mentionIds = await extractMentions(rawContent);

    return await this.dataSource.transaction(async (tx) => {
      const creationDate = new Date();

      const newNote = await tx
        .insert(schema.ticketTimelineEntries)
        .values({
          ticketId: ticketId,
          type: TicketTimelineEntryType.Note,
          entry: {
            text: text,
            rawContent: rawContent,
          } satisfies TicketNote,
          customerId: ticket.customerId,
          createdAt: creationDate,
          userCreatedById: userId,
        })
        .returning({
          id: schema.ticketTimelineEntries.id,
          createdAt: schema.ticketTimelineEntries.createdAt,
        })
        .then((res) => res[0]);

      if (!newNote) {
        tx.rollback();
        return;
      }

      if (mentionIds.length > 0) {
        await tx.insert(schema.ticketMentions).values(
          mentionIds.map((mentionId) => ({
            ticketTimelineEntryId: newNote.id,
            userId: mentionId,
            ticketId: ticket.id,
          }))
        );
      }

      return {
        id: newNote.id,
      };
    });
  }
}

export const sortDirection = (sortBy: SortDirection) => {
  return sortBy === SortDirection.ASC ? asc : desc;
};

const quantityFilterOperator = <TCol extends Column>(
  column: TCol,
  operator: QuantityFilterOperator<GetColumnData<TCol, 'raw'>>
) => {
  return 'lt' in operator
    ? lt(column, operator.lt)
    : 'gt' in operator
      ? gt(column, operator.gt)
      : 'lte' in operator
        ? lte(column, operator.lte)
        : 'gte' in operator
          ? gte(column, operator.gte)
          : undefined;
};

const inclusionFilterOperator = <TCol extends Column>(
  column: TCol,
  operator: InclusionFilterOperator<GetColumnData<TCol, 'raw'>>
) => {
  return 'in' in operator
    ? inArray(column, operator.in)
    : 'notIn' in operator
      ? notInArray(column, operator.notIn)
      : undefined;
};
