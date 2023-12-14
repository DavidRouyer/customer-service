import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  and,
  asc,
  desc,
  eq,
  exists,
  gt,
  inArray,
  isNotNull,
  isNull,
  lt,
  ne,
  not,
  schema,
  SQL,
  sql,
} from '@cs/database';
import { extractMentions, oldExtractMentions } from '@cs/lib/editor';
import {
  TicketFilter,
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
                  me: eq(schema.tickets.assignedToId, ctx.session.user.id),
                  unassigned: isNull(schema.tickets.assignedToId),
                  mentions: exists(
                    ctx.db
                      .selectDistinct({
                        id: schema.ticketMentions.ticketId,
                      })
                      .from(schema.ticketMentions)
                      .where(
                        and(
                          eq(schema.ticketMentions.userId, ctx.session.user.id),
                          eq(schema.ticketMentions.ticketId, tickets.id)
                        )
                      )
                      .limit(1)
                  ),
                }[input.filter]
          ),
        with: {
          createdBy: true,
          customer: true,
          timeline: {
            where: and(
              inArray(schema.ticketTimelineEntries.type, [
                TicketTimelineEntryType.Chat,
                TicketTimelineEntryType.Note,
              ])
            ),
            orderBy: desc(schema.ticketTimelineEntries.createdAt),
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

  stats: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.query.users.findMany({
      where: and(
        isNotNull(schema.users.id),
        ne(schema.users.id, ctx.session.user.id)
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
    } then 1 else 0 end)::int AS "done",
    sum(case when (${schema.tickets.status} = ${TicketStatus.Open} AND ${
      schema.tickets.assignedToId
    } IS NULL) then 1 else 0 end)::int AS "unassigned",
    sum(case when (${schema.tickets.status} = ${TicketStatus.Open} AND ${
      schema.tickets.assignedToId
    } = ${ctx.session.user.id ?? 0}) then 1 else 0 end)::int AS "assignedToMe",
    (SELECT
      count(DISTINCT ${schema.tickets.id})::int AS "total"
      FROM ${schema.tickets}
      LEFT JOIN ${schema.ticketMentions} ON ${
        schema.ticketMentions.ticketId
      } = ${schema.tickets.id}
      WHERE ${schema.ticketMentions.userId} = ${
        ctx.session.user.id ?? 0
      }) as "mentions"`);

    for (const user of users) {
      sqlChunks.push(sql`,`);
      sqlChunks.push(
        sql`sum(case when (${schema.tickets.status} = ${
          TicketStatus.Open
        } AND ${schema.tickets.assignedToId} = ${
          user?.id ?? 0
        }) then 1 else 0 end)::int AS "${sql.raw(`assignedTo${user.id}`)}"`
      );
    }
    sqlChunks.push(sql`FROM ${schema.tickets}`);

    const results = await ctx.db.execute<
      {
        total: number;
        open: number;
        done: number;
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
        with: {
          createdBy: true,
          customer: true,
          assignedTo: true,
          labels: {
            with: { labelType: true },
          },
        },
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      return ticket;
    }),

  byCustomerId: protectedProcedure
    .input(z.object({ customerId: z.string(), excludeId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tickets.findMany({
        orderBy: desc(schema.tickets.createdAt),
        where: and(
          eq(schema.tickets.customerId, input.customerId),
          not(eq(schema.tickets.id, input.excludeId))
        ),
      });
    }),

  assign: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
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
            assignedToId: input.userId,
            updatedAt: new Date(),
            updatedById: ctx.session.user.id,
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

        await tx.insert(schema.ticketTimelineEntries).values({
          ticketId: input.id,
          customerId: ticket.customerId,
          type: TicketTimelineEntryType.AssignmentChanged,
          entry: {
            oldAssignedToId: ticket.assignedToId,
            newAssignedToId: input.userId,
          } satisfies TicketAssignmentChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: ctx.session.user.id,
        });
      });
    }),

  unassign: protectedProcedure
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
            updatedById: ctx.session.user.id,
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

        await tx.insert(schema.ticketTimelineEntries).values({
          ticketId: input.id,
          customerId: ticket.customerId,
          type: TicketTimelineEntryType.AssignmentChanged,
          entry: {
            oldAssignedToId: ticket.assignedToId,
            newAssignedToId: null,
          } satisfies TicketAssignmentChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: ctx.session.user.id,
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
            updatedById: ctx.session.user.id,
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

        await tx.insert(schema.ticketTimelineEntries).values({
          ticketId: input.id,
          customerId: ticket.customerId,
          type: TicketTimelineEntryType.PriorityChanged,
          entry: {
            oldPriority: ticket.priority,
            newPriority: input.priority,
          } satisfies TicketPriorityChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: ctx.session.user.id,
        });
      });
    }),

  markAsDone: protectedProcedure
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
          message: 'ticket_already_marked_as_done',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            status: TicketStatus.Done,
            statusDetail: null,
            statusChangedAt: new Date(),
            statusChangedById: ctx.session.user.id,
            updatedAt: new Date(),
            updatedById: ctx.session.user.id,
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

        await tx.insert(schema.ticketTimelineEntries).values({
          ticketId: input.id,
          customerId: ticket.customerId,
          type: TicketTimelineEntryType.StatusChanged,
          entry: {
            oldStatus: ticket.status,
            newStatus: TicketStatus.Done,
          } satisfies TicketStatusChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: ctx.session.user.id,
        });
      });
    }),

  markAsOpen: protectedProcedure
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
          message: 'ticket_already_marked_as_open',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            status: TicketStatus.Open,
            statusDetail: null,
            statusChangedAt: new Date(),
            statusChangedById: ctx.session.user.id,
            updatedAt: new Date(),
            updatedById: ctx.session.user.id,
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

        await tx.insert(schema.ticketTimelineEntries).values({
          ticketId: input.id,
          customerId: ticket.customerId,
          type: TicketTimelineEntryType.StatusChanged,
          entry: {
            oldStatus: ticket.status,
            newStatus: TicketStatus.Open,
          } satisfies TicketStatusChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          userCreatedById: ctx.session.user.id,
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
        customerId: z.string().min(1),
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
            statusChangedById: ctx.session.user.id,
            createdAt: creationDate,
            createdById: ctx.session.user.id,
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

        return {
          id: newTicket.id,
        };
      });
    }),

  sendChat: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        ticketId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.ticketId),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      return await ctx.db.transaction(async (tx) => {
        const creationDate = new Date();

        const newChat = await tx
          .insert(schema.ticketTimelineEntries)
          .values({
            ticketId: input.ticketId,
            type: TicketTimelineEntryType.Chat,
            entry: {
              text: input.text,
            } satisfies TicketChat,
            customerId: ticket.customerId,
            createdAt: creationDate,
            userCreatedById: ctx.session.user.id,
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
            statusChangedById: ctx.session.user.id,
            updatedAt: newChat.createdAt,
            updatedById: ctx.session.user.id,
          })
          .where(eq(schema.tickets.id, input.ticketId));

        return {
          id: newChat.id,
        };
      });
    }),

  sendNote: protectedProcedure
    .input(
      z
        .object({
          rawContent: z.string().min(1),
          text: z.string().min(1),
          ticketId: z.string().min(1),
        })
        .refine(
          (v) => {
            try {
              JSON.parse(v.rawContent);
              return true;
            } catch (e) {
              return false;
            }
          },
          {
            path: ['rawContent'],
            message: 'rawContent must be a valid JSON string',
          }
        )
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.ticketId),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      const mentionIds = await extractMentions(input.rawContent);

      return await ctx.db.transaction(async (tx) => {
        const creationDate = new Date();

        const newNote = await tx
          .insert(schema.ticketTimelineEntries)
          .values({
            ticketId: input.ticketId,
            type: TicketTimelineEntryType.Note,
            entry: {
              text: input.text,
              rawContent: input.rawContent,
            } satisfies TicketNote,
            customerId: ticket.customerId,
            createdAt: creationDate,
            userCreatedById: ctx.session.user.id,
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
    }),
});
