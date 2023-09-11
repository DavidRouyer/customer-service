import { z } from 'zod';

import { asc, desc, eq, schema } from '@cs/database';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketRouter = createTRPCRouter({
  all: protectedProcedure
    .input(
      z.object({
        filter: z.enum(['all', 'me', 'unassigned']),
        orderBy: z.enum(['newest', 'oldest']),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.tickets.findMany({
        orderBy: {
          newest: desc(schema.tickets.createdAt),
          oldest: asc(schema.tickets.createdAt),
        }[input.orderBy],
        with: { contact: true },
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
        with: { contact: true },
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
