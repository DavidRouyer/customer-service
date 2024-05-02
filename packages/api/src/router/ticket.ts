import { z } from 'zod';

import { TicketPriority } from '@cs/kyaku/models';

import TicketService from '../services/ticket';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketRouter = createTRPCRouter({
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
