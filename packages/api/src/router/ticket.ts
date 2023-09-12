import { TRPCError } from '@trpc/server/dist/error/TRPCError';
import { z } from 'zod';

import { and, asc, desc, eq, isNull, not, schema } from '@cs/database';
import { TicketStatus } from '@cs/database/schema/ticket';

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
    .query(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
        with: { author: true, assignedTo: true },
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket not found',
        });

      return ticket;
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

  assign: protectedProcedure
    .input(z.object({ id: z.number(), contactId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket not found',
        });

      if (ticket.assignedToId === input.contactId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket is already assigned to the contact',
        });

      return ctx.db
        .update(schema.tickets)
        .set({
          assignedToId: input.contactId,
        })
        .where(eq(schema.tickets.id, input.id));
    }),

  removeAssignment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket not found',
        });

      if (ticket.assignedToId === null)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket is already assigned to nobody',
        });

      return ctx.db
        .update(schema.tickets)
        .set({
          assignedToId: null,
        })
        .where(eq(schema.tickets.id, input.id));
    }),

  resolve: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket not found',
        });

      if (ticket.status === TicketStatus.Resolved)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket is already resolved',
        });

      return ctx.db
        .update(schema.tickets)
        .set({
          status: TicketStatus.Resolved,
        })
        .where(eq(schema.tickets.id, input.id));
    }),

  reopen: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.id),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket not found',
        });

      if (ticket.status === TicketStatus.Open)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket is already reopened',
        });

      return ctx.db
        .update(schema.tickets)
        .set({
          status: TicketStatus.Open,
        })
        .where(eq(schema.tickets.id, input.id));
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
