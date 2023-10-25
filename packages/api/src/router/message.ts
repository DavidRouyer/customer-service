import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { asc, eq, schema } from '@cs/database';
import { MessageStatus } from '@cs/lib/messages';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
  all: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.messages.findMany({
        where: eq(schema.messages.ticketId, input.ticketId),
        orderBy: asc(schema.messages.createdAt),
        with: { author: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        contentType: z.enum(schema.messages.contentType.enumValues),
        createdAt: z.date(),
        direction: z.enum(schema.messages.direction.enumValues),
        authorId: z.number(),
        ticketId: z.number(),
        status: z.enum(schema.messages.status.enumValues),
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

      return ctx.db
        .insert(schema.messages)
        .values({
          ...input,
          status: MessageStatus.DeliveredToCloud,
          createdAt: input.createdAt,
        })
        .returning({ id: schema.messages.id });
    }),
});
