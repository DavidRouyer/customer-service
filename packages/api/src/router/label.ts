import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { and, eq, inArray, schema } from '@cs/database';
import {
  TicketActivityType,
  TicketLabelsChanged,
} from '@cs/lib/ticketActivities';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const labelRouter = createTRPCRouter({
  addLabels: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        labelTypeIds: z.array(z.string()),
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

      const missingLabelTypes: string[] = [];
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
        const newLabels = await tx
          .insert(schema.labels)
          .values(
            labelTypes.map((labelType) => ({
              ticketId: ticket.id,
              labelTypeId: labelType.id,
            }))
          )
          .returning({ labelId: schema.labels.id });

        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            updatedAt: new Date(),
            updatedById: ctx.session.user.id,
          })
          .where(eq(schema.tickets.id, ticket.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: ticket.id,
          type: TicketActivityType.LabelsChanged,
          extraInfo: {
            oldLabelIds: [],
            newLabelIds: newLabels.map((label) => label.labelId),
          } satisfies TicketLabelsChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.id,
        });
      });
    }),

  removeLabels: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        labelIds: z.array(z.string()),
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

      const labels = await ctx.db.query.labels.findMany({
        where: inArray(schema.labelTypes.id, input.labelIds),
      });

      const missingLabels: string[] = [];
      for (const labelId of input.labelIds) {
        if (!labels.find((label) => label.id === labelId)) {
          missingLabels.push(labelId);
        }
      }
      if (missingLabels.length > 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'label_missing_ids',
        });

      return await ctx.db.transaction(async (tx) => {
        const deletedLabels = await tx
          .delete(schema.labels)
          .where(
            and(
              eq(schema.labels.ticketId, ticket.id),
              inArray(schema.labels.id, input.labelIds)
            )
          )
          .returning({ labelId: schema.labels.id });

        const updatedTicket = await tx
          .update(schema.tickets)
          .set({
            updatedAt: new Date(),
            updatedById: ctx.session.user.id,
          })
          .where(eq(schema.tickets.id, ticket.id))
          .returning({
            id: schema.tickets.id,
            updatedAt: schema.tickets.updatedAt,
          })
          .then((res) => res[0]);

        if (!updatedTicket) {
          tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: ticket.id,
          type: TicketActivityType.LabelsChanged,
          extraInfo: {
            oldLabelIds: deletedLabels.map((label) => label.labelId),
            newLabelIds: [],
          } satisfies TicketLabelsChanged,
          createdAt: updatedTicket.updatedAt ?? new Date(),
          createdById: ctx.session.user.id,
        });
      });
    }),
});
