import { z } from 'zod';

import { TicketPriority, TicketStatus } from '@cs/kyaku/models';
import { SortDirection } from '@cs/kyaku/types';
import { Direction } from '@cs/kyaku/types/query';

import TicketService from '../services/ticket';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const inclusionFilterRouter = <T extends z.ZodTypeAny>(objectType: T) => {
  return z
    .union([
      z.object({ eq: objectType.nullable() }),
      z.object({ ne: objectType.nullable() }),
      z.object({ in: objectType.array() }),
      z.object({ notIn: objectType.array() }),
    ])
    .optional();
};

export const ticketRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        filters: z.object({
          assignedToUser: inclusionFilterRouter(z.string()),
          customer: inclusionFilterRouter(z.string()),
          priority: inclusionFilterRouter(
            z.enum([
              TicketPriority.Low,
              TicketPriority.Medium,
              TicketPriority.High,
              TicketPriority.Critical,
            ])
          ),
          status: inclusionFilterRouter(
            z.enum([TicketStatus.Open, TicketStatus.Done])
          ),
          ticketId: inclusionFilterRouter(z.string()),
        }),
        sortBy: z
          .object({
            createdAt: z.enum([SortDirection.ASC, SortDirection.DESC]),
          })
          .or(
            z.object({
              statusChangedAt: z.enum([SortDirection.ASC, SortDirection.DESC]),
            })
          )
          .optional(),
        cursor: z.string().nullish(),
        limit: z.number().default(50),
        direction: z
          .enum([Direction.Forward, Direction.Backward])
          .default(Direction.Forward),
      })
    )
    .query(async ({ ctx, input }) => {
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
      const tickets = await ticketService.list(input.filters, {
        sortBy: input.sortBy,
        relations: {
          assignedTo: true,
          createdBy: true,
          customer: true,
          labels: true,
          updatedBy: true,
        },
        limit: input.limit,
        cursor: input.cursor ? input.cursor : undefined,
        direction: input.direction,
      });

      return {
        data: tickets.items,
        hasNextPage: tickets.hasNextPage,
        nextCursor: 'tickets.nextCursor',
      };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
      return await ticketService.retrieve(input.id, {
        relations: {
          assignedTo: true,
          createdBy: true,
          customer: true,
          labels: true,
          updatedBy: true,
        },
      });
    }),

  assign: protectedProcedure
    .input(z.object({ id: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
      return await ticketService.assign(
        input.id,
        input.userId,
        ctx.session.user.id
      );
    }),

  unassign: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
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
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
      return await ticketService.changePriority(
        input.id,
        input.priority,
        ctx.session.user.id
      );
    }),

  markAsDone: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
      return await ticketService.markAsDone(input.id, ctx.session.user.id);
    }),

  markAsOpen: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
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
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
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
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
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
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
      return await ticketService.sendNote(
        input.ticketId,
        input.text,
        input.rawContent,
        ctx.session.user.id
      );
    }),
});
