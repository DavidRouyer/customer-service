import { z } from 'zod';

import { and, asc, desc, eq, isNull, not, schema } from '@cs/database';

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
        where: {
          all: undefined,
          me: eq(schema.tickets.assignedToId, ctx.session.user.contactId ?? 0),
          unassigned: isNull(schema.tickets.assignedToId),
        }[input.filter],
        with: { author: true },
      });
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
        with: { author: true, assignedTo: true },
      });
    }),

  byContactId: protectedProcedure
    .input(z.object({ contactId: z.number(), excludeId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tickets.findMany({
        orderBy: desc(schema.tickets.createdAt),
        where: and(
          eq(schema.tickets.authorId, input.contactId),
          not(eq(schema.tickets.id, input.excludeId))
        ),
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
