import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  and,
  asc,
  desc,
  eq,
  exists,
  gt,
  isNotNull,
  isNull,
  lt,
  ne,
  not,
  schema,
  SQL,
  sql,
} from '@cs/database';
import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@cs/lib/messages';
import {
  TicketActivityType,
  TicketAssignmentAdded,
  TicketAssignmentChanged,
  TicketAssignmentRemoved,
  TicketPriorityChanged,
} from '@cs/lib/ticketActivities';
import {
  TicketFilter,
  TicketPriority,
  TicketStatus,
  TicketStatusDetail,
} from '@cs/lib/tickets';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        filter: z
          .enum([
            TicketFilter.All,
            TicketFilter.Me,
            TicketFilter.Unassigned,
            TicketFilter.Mentions,
          ])
          .or(z.string()),
        status: z.enum([TicketStatus.Open, TicketStatus.Done]),
        orderBy: z.enum(['newest', 'oldest']),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const PAGE_SIZE = 10;
      const tickets = await ctx.db.query.tickets.findMany({
        orderBy: {
          newest: desc(schema.tickets.createdAt),
          oldest: asc(schema.tickets.createdAt),
        }[input.orderBy],
        where: (tickets) =>
          and(
            eq(schema.tickets.status, input.status),
            {
              newest: input.cursor
                ? lt(schema.tickets.createdAt, new Date(input.cursor))
                : undefined,
              oldest: input.cursor
                ? gt(schema.tickets.createdAt, new Date(input.cursor))
                : undefined,
            }[input.orderBy],
            typeof input.filter === 'number'
              ? eq(schema.tickets.assignedToId, input.filter)
              : {
                  all: undefined,
                  me: eq(
                    schema.tickets.assignedToId,
                    ctx.session.user.contactId ?? ''
                  ),
                  unassigned: isNull(schema.tickets.assignedToId),
                  mentions: exists(
                    ctx.db
                      .selectDistinct({
                        id: schema.contactsToTicketComments.ticketId,
                      })
                      .from(schema.contactsToTicketComments)
                      .where(
                        and(
                          eq(
                            schema.contactsToTicketComments.contactId,
                            ctx.session.user.contactId ?? ''
                          ),
                          eq(
                            schema.contactsToTicketComments.ticketId,
                            tickets.id
                          )
                        )
                      )
                      .limit(1)
                  ),
                }[input.filter]
          ),
        with: {
          createdBy: true,
          messages: {
            orderBy: desc(schema.messages.createdAt),
            limit: 1,
          },
          labels: {
            columns: {
              id: true,
            },
            with: {
              labelType: true,
            },
          },
          assignedTo: true,
        },
        limit: PAGE_SIZE,
      });

      const nextCursor =
        tickets[tickets.length - 1]?.createdAt.toISOString() ?? null;

      return { data: tickets, nextCursor };
    }),

  conversation: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.query.messages.findMany({
        where: eq(schema.messages.ticketId, input.ticketId),
        orderBy: asc(schema.messages.createdAt),
        with: { createdBy: true },
      });
      const comments = await ctx.db.query.ticketComments.findMany({
        orderBy: asc(schema.ticketComments.createdAt),
        where: eq(schema.ticketComments.ticketId, input.ticketId),
        with: { createdBy: true },
      });
      return [
        ...messages.map((message) => ({
          ...message,
          type: 'message' as const,
        })),
        ...comments.map((comment) => ({
          ...comment,
          status: MessageStatus.Seen,
          contentType: MessageContentType.TextJson,
          direction: MessageDirection.Outbound,
          content: JSON.stringify(comment.content),
          type: 'comment' as const,
        })),
      ].toSorted((a, b) => {
        if (a.createdAt < b.createdAt) return -1;
        if (a.createdAt > b.createdAt) return 1;
        return 0;
      });
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const contacts = await ctx.db.query.contacts.findMany({
      where: and(
        isNotNull(schema.contacts.userId),
        ne(schema.contacts.id, ctx.session.user.contactId ?? '')
      ),
    });

    const sqlChunks: SQL[] = [];

    sqlChunks.push(sql`SELECT
    count(*)::int AS "total",
    sum(case when ${schema.tickets.status} = ${
      TicketStatus.Open
    } then 1 else 0 end)::int AS "open",
    sum(case when ${schema.tickets.status} = ${
      TicketStatus.Done
    } then 1 else 0 end)::int AS "resolved",
    sum(case when (${schema.tickets.status} = ${TicketStatus.Open} AND ${
      schema.tickets.assignedToId
    } IS NULL) then 1 else 0 end)::int AS "unassigned",
    sum(case when (${schema.tickets.status} = ${TicketStatus.Open} AND ${
      schema.tickets.assignedToId
    } = ${
      ctx.session.user.contactId ?? 0
    }) then 1 else 0 end)::int AS "assignedToMe",
    (SELECT
      count(DISTINCT ${schema.tickets.id})::int AS "total"
      FROM ${schema.tickets}
      LEFT JOIN ${schema.contactsToTicketComments} ON ${
        schema.contactsToTicketComments.ticketId
      } = ${schema.tickets.id}
      WHERE ${schema.contactsToTicketComments.contactId} = ${
        ctx.session.user.contactId ?? 0
      }) as "mentions"`);

    for (const contact of contacts) {
      sqlChunks.push(sql`,`);
      sqlChunks.push(
        sql`sum(case when (${schema.tickets.status} = ${
          TicketStatus.Open
        } AND ${schema.tickets.assignedToId} = ${
          contact?.id ?? 0
        }) then 1 else 0 end)::int AS "${sql.raw(`assignedTo${contact.id}`)}"`
      );
    }
    sqlChunks.push(sql`FROM ${schema.tickets}`);

    const results = await ctx.db.execute<
      {
        total: number;
        open: number;
        resolved: number;
        unassigned: number;
        assignedToMe: number;
        mentions: number;
      } & Record<string, number>
    >(sql.join(sqlChunks, sql.raw(' ')));

    return results.rows[0];
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
        with: { createdBy: true, assignedTo: true, labels: true },
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      return ticket;
    }),

  byContactId: protectedProcedure
    .input(z.object({ contactId: z.string(), excludeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tickets.findMany({
        orderBy: desc(schema.tickets.createdAt),
        where: and(
          eq(schema.tickets.createdById, input.contactId),
          not(eq(schema.tickets.id, input.excludeId))
        ),
      });
    }),

  addAssignment: protectedProcedure
    .input(z.object({ id: z.string(), contactId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      if (ticket.assignedToId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_already_assigned',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            assignedToId: input.contactId,
            updatedAt: new Date(),
            updatedById: ctx.session.user.contactId ?? '',
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          type: TicketActivityType.AssignmentAdded,
          extraInfo: {
            newAssignedToId: input.contactId,
          } satisfies TicketAssignmentAdded,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.contactId ?? '',
        });
      });
    }),

  changeAssignment: protectedProcedure
    .input(z.object({ id: z.string(), contactId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      if (!ticket.assignedToId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_assigned',
        });

      if (ticket.assignedToId === input.contactId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_already_assigned_to_contact',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            assignedToId: input.contactId,
            updatedAt: new Date(),
            updatedById: ctx.session.user.contactId ?? '',
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          type: TicketActivityType.AssignmentChanged,
          extraInfo: {
            oldAssignedToId: ticket.assignedToId ?? '',
            newAssignedToId: input.contactId,
          } satisfies TicketAssignmentChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.contactId ?? '',
        });
      });
    }),

  removeAssignment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      if (!ticket.assignedToId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_assigned',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            assignedToId: null,
            updatedAt: new Date(),
            updatedById: ctx.session.user.contactId ?? '',
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          type: TicketActivityType.AssignmentRemoved,
          extraInfo: {
            oldAssignedToId: ticket.assignedToId ?? '',
          } satisfies TicketAssignmentRemoved,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.contactId ?? '',
        });
      });
    }),

  changePriority: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        priority: z.enum([
          TicketPriority.Low,
          TicketPriority.Medium,
          TicketPriority.High,
          TicketPriority.Critical,
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            priority: input.priority,
            updatedAt: new Date(),
            updatedById: ctx.session.user.contactId ?? '',
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          type: TicketActivityType.PriorityChanged,
          extraInfo: {
            oldPriority: ticket.priority,
            newPriority: input.priority,
          } satisfies TicketPriorityChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.contactId ?? '',
        });
      });
    }),

  resolve: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      if (ticket.status === TicketStatus.Done)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_already_resolved',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            status: TicketStatus.Done,
            statusDetail: null,
            statusChangedAt: new Date(),
            statusChangedById: ctx.session.user.contactId ?? '',
            updatedAt: new Date(),
            updatedById: ctx.session.user.contactId ?? '',
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          type: TicketActivityType.Resolved,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.contactId ?? '',
        });
      });
    }),

  reopen: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      if (ticket.status === TicketStatus.Open)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_already_opened',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            status: TicketStatus.Open,
            statusDetail: null,
            statusChangedAt: new Date(),
            statusChangedById: ctx.session.user.contactId ?? '',
            updatedAt: new Date(),
            updatedById: ctx.session.user.contactId ?? '',
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          type: TicketActivityType.Reopened,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.contactId ?? '',
        });
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        priority: z.enum([
          TicketPriority.Low,
          TicketPriority.Medium,
          TicketPriority.High,
          TicketPriority.Critical,
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const creationDate = new Date();

        const newTicket = await tx
          .insert(schema.tickets)
          .values({
            ...input,
            status: TicketStatus.Open,
            statusDetail: TicketStatusDetail.Created,
            statusChangedAt: creationDate,
            statusChangedById: ctx.session.user.contactId ?? '',
            createdAt: creationDate,
            createdById: ctx.session.user.contactId ?? '',
          })
          .returning({
            id: schema.tickets.id,
            createdAt: schema.tickets.createdAt,
          })
          .then((res) => res[0]);

        if (!newTicket) {
          tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: newTicket.id,
          type: TicketActivityType.Created,
          createdAt: newTicket.createdAt,
          createdById: ctx.session.user.contactId ?? '',
        });

        return {
          id: newTicket.id,
        };
      });
    }),
});
