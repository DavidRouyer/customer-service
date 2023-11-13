import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { and, eq, inArray, schema } from '@cs/database';

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

      return ctx.db
        .insert(schema.labels)
        .values(
          labelTypes.map((labelType) => ({
            ticketId: ticket.id,
            labelTypeId: labelType.id,
          }))
        )
        .returning({ id: schema.labelTypes.id });
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

      return ctx.db
        .delete(schema.labels)
        .where(
          and(
            eq(schema.labels.ticketId, ticket.id),
            inArray(schema.labels.labelTypeId, input.labelTypeIds)
          )
        )
        .returning({ id: schema.labelTypes.id });
    }),
});
