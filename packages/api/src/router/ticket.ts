import { z } from 'zod';

import {
  and,
  db,
  desc,
  eq,
  inArray,
  isNotNull,
  ne,
  not,
  schema,
  SQL,
  sql,
} from '@cs/database';
import { TicketPriority, TicketStatus } from '@cs/lib/tickets';
import { TicketTimelineEntryType } from '@cs/lib/ticketTimelineEntries';

import { SortDirection } from '../entities/ticket';
import TicketService from '../services/ticket';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const ticketService = new TicketService(db);

export const ticketRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        assignedToId: z.string().array().nullish().optional(),
        status: z.enum([TicketStatus.Open, TicketStatus.Done]),
        sortBy: z
          .object({
            createdAt: z.enum([SortDirection.ASC, SortDirection.DESC]),
          })
          .or(
            z.object({
              priority: z.enum([SortDirection.ASC, SortDirection.DESC]),
            })
          )
          .optional(),
        cursor: z.string().nullish(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const tickets = await ticketService.list(
        {
          status: input.status,
          assignedToId: input.assignedToId,
        },
        {
          sortBy: input.sortBy,
          relations: {
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
          take: input.limit,
        }
      );

      const nextCursor = tickets[tickets.length - 1]?.id ?? null;

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
    .query(async ({ input }) => {
      return await ticketService.retrieve(input.id, {
        relations: {
          createdBy: true,
          customer: true,
          assignedTo: true,
          labels: {
            with: { labelType: true },
          },
        },
      });
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
      return await ticketService.assign(
        input.id,
        input.userId,
        ctx.session.user.id
      );
    }),

  unassign: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ticketService.unassign(input.id, ctx.session.user.id);
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
      return await ticketService.changePriority(
        input.id,
        input.priority,
        ctx.session.user.id
      );
    }),

  markAsDone: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ticketService.markAsDone(input.id, ctx.session.user.id);
    }),

  markAsOpen: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ticketService.markAsOpen(input.id, ctx.session.user.id);
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
      return ticketService.create({
        ...input,
        createdById: ctx.session.user.id,
        statusChangedById: ctx.session.user.id,
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
      return await ticketService.sendChat(
        input.ticketId,
        input.text,
        ctx.session.user.id
      );
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
      return await ticketService.sendNote(
        input.ticketId,
        input.text,
        input.rawContent,
        ctx.session.user.id
      );
    }),
});
