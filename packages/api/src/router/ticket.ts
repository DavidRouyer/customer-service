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
  TicketActivityType,
  TicketAssignmentAdded,
  TicketAssignmentChanged,
  TicketAssignmentRemoved,
} from '@cs/database/schema/ticketActivity';
import { TicketFilter, TicketStatus } from '@cs/lib';

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
          .or(z.number()),
        status: z.enum([TicketStatus.Open, TicketStatus.Resolved]),
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
                    ctx.session.user.contactId ?? 0
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
                            ctx.session.user.contactId ?? 0
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
          author: true,
          messages: {
            orderBy: desc(schema.messages.createdAt),
            limit: 1,
          },
        },
        limit: PAGE_SIZE,
      });

      const nextCursor =
        tickets[tickets.length - 1]?.createdAt.toISOString() ?? null;

      return { data: tickets, nextCursor };
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const contacts = await ctx.db.query.contacts.findMany({
      where: and(
        isNotNull(schema.contacts.userId),
        ne(schema.contacts.id, ctx.session.user.contactId ?? 0)
      ),
    });

    const sqlChunks: SQL[] = [];

    sqlChunks.push(sql`SELECT
    count(*)::int AS "total",
    sum(case when ${schema.tickets.status} = ${
      TicketStatus.Open
    } then 1 else 0 end)::int AS "open",
    sum(case when ${schema.tickets.status} = ${
      TicketStatus.Resolved
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
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
        with: { author: true, assignedTo: true },
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      return ticket;
    }),

  byContactId: protectedProcedure
    .input(z.object({ contactId: z.number(), excludeId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tickets.findMany({
        orderBy: desc(schema.tickets.createdAt),
        where: and(
          eq(schema.tickets.authorId, input.contactId),
          not(eq(schema.tickets.id, input.excludeId))
        ),
      });
    }),

  addAssignment: protectedProcedure
    .input(z.object({ id: z.number(), contactId: z.number() }))
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
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.AssignmentAdded,
          extraInfo: {
            newAssignedToId: input.contactId,
          } satisfies TicketAssignmentAdded,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
    }),

  changeAssignment: protectedProcedure
    .input(z.object({ id: z.number(), contactId: z.number() }))
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
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.AssignmentChanged,
          extraInfo: {
            oldAssignedToId: ticket.assignedToId ?? 0,
            newAssignedToId: input.contactId,
          } satisfies TicketAssignmentChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
    }),

  removeAssignment: protectedProcedure
    .input(z.object({ id: z.number() }))
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
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.AssignmentRemoved,
          extraInfo: {
            oldAssignedToId: ticket.assignedToId ?? 0,
          } satisfies TicketAssignmentRemoved,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
    }),

  resolve: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      if (ticket.status === TicketStatus.Resolved)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_already_resolved',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            status: TicketStatus.Resolved,
            resolvedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.Resolved,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
    }),

  reopen: protectedProcedure
    .input(z.object({ id: z.number() }))
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
            resolvedAt: null,
            updatedAt: new Date(),
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.Reopened,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        authorId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const newTicket = await tx
          .insert(schema.tickets)
          .values({
            ...input,
            status: TicketStatus.Open,
            createdAt: new Date(),
          })
          .returning({
            id: schema.tickets.id,
            createdAt: schema.tickets.createdAt,
          })
          .then((res) => res[0]);

        if (!newTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: newTicket.id,
          authorId: input.authorId,
          type: TicketActivityType.Created,
          createdAt: newTicket.createdAt,
        });

        return {
          id: newTicket.id,
        };
      });
    }),
});
