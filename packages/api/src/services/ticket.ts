import {
  and,
  asc,
  desc,
  eq,
  gt,
  inArray,
  isNull,
  schema,
  SQL,
} from '@cs/database';
import { extractMentions } from '@cs/kyaku/editor';
import {
  TicketAssignmentChanged,
  TicketChat,
  TicketNote,
  TicketPriority,
  TicketPriorityChanged,
  TicketStatus,
  TicketStatusChanged,
  TicketStatusDetail,
  TicketTimelineEntryType,
} from '@cs/kyaku/models';
import { KyakuError } from '@cs/kyaku/utils';

import {
  FindTicketConfig,
  GetTicketConfig,
  Ticket,
  TicketCursor,
  TicketFilters,
  TicketRelations,
} from '../entities/ticket';
import { BaseService } from './base-service';
import {
  filterBySortDirection,
  inclusionFilterOperator,
  quantityFilterOperator,
  sortDirection,
} from './build-query';

export default class TicketService extends BaseService {
  constructor() {
    // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-unsafe-argument
    super(arguments[0]);
  }

  async retrieve(
    ticketId: string,
    config: GetTicketConfig = { relations: {} }
  ) {
    const ticket = await this.dataSource.query.tickets.findFirst({
      where: eq(schema.tickets.id, ticketId),
      with: this.getWithClause(config.relations),
    });

    if (!ticket)
      throw new KyakuError('NOT_FOUND', `Ticket with id:${ticketId} not found`);

    return ticket;
  }

  async list(
    filters: TicketFilters,
    config: FindTicketConfig = {
      relations: {},
    }
  ) {
    const [cursorWhereClause, cursorOrderByClause] =
      this.getCursorClauses(config);
    const whereClause = this.getWhereClause(filters);

    const fetchedTickets = await this.dataSource.query.tickets.findMany({
      where: and(whereClause, cursorWhereClause),
      with: this.getWithClause(config.relations),
      limit: config.take ? config.take + 1 : undefined,
      orderBy: cursorOrderByClause,
    });

    if (config.take) {
      const items = fetchedTickets.slice(0, config.take);
      const lastItem = items.at(-1);
      return {
        items: items,
        hasNextPage: fetchedTickets.length > config.take,
        nextCursor: lastItem ? this.encodeCursor(lastItem, config) : undefined,
      };
    }

    return {
      items: fetchedTickets,
      hasNextPage: false,
      nextCursor: undefined,
    };
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

  private getWithClause(relations: TicketRelations) {
    return {
      labels: relations?.labels
        ? ({
            columns: {
              id: true,
            },
            with: {
              labelType: true,
            },
          } as const)
        : undefined,
      timelineEntries: relations?.lastTimelineEntry
        ? {
            where: and(
              inArray(schema.ticketTimelineEntries.type, [
                TicketTimelineEntryType.Chat,
                TicketTimelineEntryType.Note,
              ])
            ),
            orderBy: desc(schema.ticketTimelineEntries.createdAt),
            limit: 1,
          }
        : undefined,
      customer: relations?.customer ? (true as const) : undefined,
      assignedTo: relations?.assignedTo ? (true as const) : undefined,
      createdBy: relations?.createdBy
        ? ({
            columns: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          } as const)
        : undefined,
      updatedBy: relations?.updatedBy
        ? ({
            columns: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          } as const)
        : undefined,
    };
  }

  private getWhereClause(filters: TicketFilters) {
    return and(
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
      filters.status ? eq(schema.tickets.status, filters.status) : undefined
    );
  }

  private getCursorClauses(config: FindTicketConfig) {
    const cursor = config.skip ? this.decodeCursor(config.skip) : undefined;
    let whereClause = cursor ? gt(schema.tickets.id, cursor.id) : undefined;

    let orderByClause: SQL<unknown> | SQL<unknown>[] | undefined = asc(
      schema.tickets.id
    );
    if (config.sortBy) {
      if ('statusChangedAt' in config.sortBy) {
        whereClause = cursor
          ? and(
              cursor?.statusChangedAt
                ? filterBySortDirection(config.sortBy.statusChangedAt)(
                    schema.tickets.statusChangedAt,
                    new Date(cursor?.statusChangedAt)
                  )
                : undefined,
              cursor?.id
                ? filterBySortDirection(config.sortBy.statusChangedAt)(
                    schema.tickets.id,
                    cursor.id
                  )
                : undefined
            )
          : undefined;
        orderByClause = [
          sortDirection(config.sortBy.statusChangedAt)(
            schema.tickets.statusChangedAt
          ),
          sortDirection(config.sortBy.statusChangedAt)(schema.tickets.id),
        ];
      }
      if ('createdAt' in config.sortBy) {
        whereClause = cursor
          ? and(
              cursor?.createdAt
                ? filterBySortDirection(config.sortBy.createdAt)(
                    schema.tickets.createdAt,
                    new Date(cursor.createdAt)
                  )
                : undefined,
              cursor?.id
                ? filterBySortDirection(config.sortBy.createdAt)(
                    schema.tickets.id,
                    cursor.id
                  )
                : undefined
            )
          : undefined;
        orderByClause = [
          sortDirection(config.sortBy.createdAt)(schema.tickets.createdAt),
          sortDirection(config.sortBy.createdAt)(schema.tickets.id),
        ];
      }
    }

    return [whereClause, orderByClause] as const;
  }

  private decodeCursor(cursor: string) {
    let decodedCursor = null;
    try {
      decodedCursor = JSON.parse(atob(cursor)) as TicketCursor;
    } catch (e) {
      throw new KyakuError('BAD_REQUEST', 'Invalid cursor');
    }
    return decodedCursor;
  }

  private encodeCursor(
    ticket: Ticket,
    config: FindTicketConfig
  ): string | null {
    if (!config.sortBy) return null;
    let cursor: TicketCursor = {
      id: ticket.id,
    };
    if ('createdAt' in config.sortBy) {
      cursor = {
        createdAt: ticket.createdAt.toUTCString(),
        id: ticket.id,
      };
    }
    if ('statusChangedAt' in config.sortBy) {
      cursor = {
        statusChangedAt: ticket.statusChangedAt?.toUTCString(),
        id: ticket.id,
      };
    }
    return btoa(JSON.stringify(cursor));
  }
}
