import { z } from 'zod';

import { asc, eq, schema } from '@cs/database';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
  all: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.messages.findMany({
        where: eq(schema.messages.ticketId, input.ticketId),
        orderBy: asc(schema.messages.createdAt),
        with: { sender: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        contentType: z.enum(schema.messages.contentType.enumValues),
        createdAt: z.date(),
        direction: z.enum(schema.messages.direction.enumValues),
        senderId: z.number(),
        ticketId: z.number(),
        status: z.enum(schema.messages.status.enumValues),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(schema.messages)
        .values({
          ...input,
          createdAt: input.createdAt,
        })
        .returning({ id: schema.messages.id });
    }),

  /*delete: publicProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.message).where(eq(schema.message.id, input));
  }),*/
});
