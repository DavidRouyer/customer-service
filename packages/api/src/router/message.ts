import { z } from 'zod';

import { asc, eq, schema } from '@cs/database';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
  all: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.message.findMany({
        where: eq(schema.ticket.id, input.ticketId),
        orderBy: asc(schema.message.createdAt),
        with: { sender: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        contentType: z.enum(schema.message.contentType.enumValues),
        createdAt: z.date(),
        direction: z.enum(schema.message.direction.enumValues),
        senderId: z.number(),
        ticketId: z.number(),
        status: z.enum(schema.message.status.enumValues),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(schema.message)
        .values({
          ...input,
          createdAt: input.createdAt.toISOString(),
        })
        .returning({ id: schema.message.id });
    }),

  /*delete: publicProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.message).where(eq(schema.message.id, input));
  }),*/
});
