import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { and, eq, inArray, schema } from '@cs/database';
import {
  TicketActivityType,
  TicketLabelAdded,
  TicketLabelRemoved,
} from '@cs/lib/ticketActivities';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const labelRouter = createTRPCRouter({
  addLabels: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
        labelTypeIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.ticketId),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_exists',
        });

      const labelTypes = await ctx.db.query.labelTypes.findMany({
        where: inArray(schema.labelTypes.id, input.labelTypeIds),
      });

      const missingLabelTypes: number[] = [];
      for (const labelTypeId of input.labelTypeIds) {
        if (!labelTypes.find((labelType) => labelType.id === labelTypeId)) {
          missingLabelTypes.push(labelTypeId);
        }
      }
      if (missingLabelTypes.length > 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'label_type_missing_ids',
        });

      return await ctx.db.transaction(async (tx) => {
        await tx
          .insert(schema.labels)
          .values(
            labelTypes.map((labelType) => ({
              ticketId: ticket.id,
              labelTypeId: labelType.id,
            }))
          )
          .returning({ labelTypeId: schema.labels.labelTypeId });

        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            updatedAt: new Date(),
            updatedById: ctx.session.user.contactId ?? 0,
          })
          .where(eq(schema.tickets.id, ticket.id))
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
          ticketId: ticket.id,
          type: TicketActivityType.LabelAdded,
          extraInfo: {
            labelTypeIds: input.labelTypeIds,
          } satisfies TicketLabelAdded,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.contactId ?? 0,
        });
      });
    }),

  removeLabels: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
        labelTypeIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.ticketId),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_exists',
        });

      const labelTypes = await ctx.db.query.labelTypes.findMany({
        where: inArray(schema.labelTypes.id, input.labelTypeIds),
      });

      const missingLabelTypes: number[] = [];
      for (const labelTypeId of input.labelTypeIds) {
        if (!labelTypes.find((labelType) => labelType.id === labelTypeId)) {
          missingLabelTypes.push(labelTypeId);
        }
      }
      if (missingLabelTypes.length > 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'label_type_missing_ids',
        });

      return await ctx.db.transaction(async (tx) => {
        await tx
          .delete(schema.labels)
          .where(
            and(
              eq(schema.labels.ticketId, ticket.id),
              inArray(schema.labels.labelTypeId, input.labelTypeIds)
            )
          )
          .returning({ labelTypeId: schema.labels.labelTypeId });

        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            updatedAt: new Date(),
            updatedById: ctx.session.user.contactId ?? 0,
          })
          .where(eq(schema.tickets.id, ticket.id))
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
          ticketId: ticket.id,
          type: TicketActivityType.LabelRemoved,
          extraInfo: {
            labelTypeIds: input.labelTypeIds,
          } satisfies TicketLabelRemoved,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.contactId ?? 0,
        });
      });
    }),
});
