import { z } from 'zod';

import { desc, eq, schema } from '@cs/database';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.ticket.findMany({
      orderBy: desc(schema.ticket.id),
      with: { contact: true },
    });
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.ticket.findFirst({
        where: eq(schema.ticket.id, input.id),
      });
    }),

  /*create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(schema.ticket).values(input);
    }),

  delete: publicProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.ticket).where(eq(schema.ticket.id, input));
  }),*/
});
