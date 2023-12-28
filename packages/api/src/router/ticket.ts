import { z } from 'zod';

import { and, desc, inArray, schema } from '@cs/database';
import {
  TicketPriority,
  TicketStatus,
  TicketTimelineEntryType,
} from '@cs/kyaku/models';
import { SortDirection } from '@cs/kyaku/types';

import TicketService from '../services/ticket';
import { createTRPCRouter, protectedProcedure } from '../trpc';

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
    .query(async ({ ctx, input }) => {
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
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

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
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
    .query(async ({ ctx, input }) => {
      const ticketService: TicketService =
        ctx.container.resolve('ticketService');
      return await ticketService.list({
        customerId: input.customerId,
        id: { notIn: [input.excludeId] },
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
