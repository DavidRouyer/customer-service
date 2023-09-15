import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { and, asc, desc, eq, isNull, not, schema } from '@cs/database';
import { TicketStatus } from '@cs/database/schema/ticket';
import {
  TicketActivityType,
  TicketAssignmentAdded,
  TicketAssignmentChanged,
  TicketAssignmentRemoved,
} from '@cs/database/schema/ticketActivity';

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

  addAssignment: protectedProcedure
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

      if (ticket.assignedToId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket is already assigned',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            assignedToId: input.contactId,
            updatedAt: new Date(),
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.AssignmentAdded,
          extraInfo: {
            newAssignedToId: input.contactId,
          } satisfies TicketAssignmentAdded,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
    }),

  changeAssignment: protectedProcedure
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

      if (!ticket.assignedToId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket is not assigned to anybody',
        });

      if (ticket.assignedToId === input.contactId)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Ticket is already assigned to the contact',
        });

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            assignedToId: input.contactId,
            updatedAt: new Date(),
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.AssignmentChanged,
          extraInfo: {
            oldAssignedToId: ticket.assignedToId ?? 0,
            newAssignedToId: input.contactId,
          } satisfies TicketAssignmentChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
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

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            assignedToId: null,
            updatedAt: new Date(),
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.AssignmentRemoved,
          extraInfo: {
            oldAssignedToId: ticket.assignedToId ?? 0,
          } satisfies TicketAssignmentRemoved,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
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

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            status: TicketStatus.Resolved,
            resolvedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.Resolved,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
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

      return await ctx.db.transaction(async (tx) => {
        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            status: TicketStatus.Open,
            resolvedAt: null,
            updatedAt: new Date(),
          })
          .where(eq(schema.tickets.id, input.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.id,
          authorId: ctx.session.user.contactId ?? 0,
          type: TicketActivityType.Reopened,
          createdAt: updatedTicket.updatedAt ?? new Date(),
        });
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        authorId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const newTicket = await tx
          .insert(schema.tickets)
          .values({
            ...input,
            status: TicketStatus.Open,
            createdAt: new Date(),
          })
          .returning({
            id: schema.tickets.id,
            createdAt: schema.tickets.createdAt,
          })
          .then((res) => res[0]);

        if (!newTicket) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: newTicket.id,
          authorId: input.authorId,
          type: TicketActivityType.Created,
          createdAt: newTicket.createdAt,
        });

        return {
          id: newTicket.id,
        };
      });
    }),
});
