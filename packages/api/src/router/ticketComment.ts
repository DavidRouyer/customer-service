import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { asc, eq, schema } from '@cs/database';
import {
  TicketActivityType,
  TicketCommented,
} from '@cs/database/schema/ticketActivity';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketCommentRouter = createTRPCRouter({
  byTicketId: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.ticketComments.findMany({
        orderBy: asc(schema.ticketComments.createdAt),
        where: eq(schema.ticketComments.ticketId, input.ticketId),
        with: { author: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        createdAt: z.date(),
        authorId: z.number(),
        ticketId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ticket = await ctx.db.query.tickets.findFirst({
        where: eq(schema.tickets.id, input.ticketId),
      });

      if (!ticket)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'ticket_not_found',
        });

      return await ctx.db.transaction(async (tx) => {
        const newComment = await tx
          .insert(schema.ticketComments)
          .values({
            ...input,
            createdAt: input.createdAt,
          })
          .returning({
            id: schema.ticketComments.id,
            createdAt: schema.ticketComments.createdAt,
          })
          .then((res) => res[0]);

        if (!newComment) {
          await tx.rollback();
          return;
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.ticketId,
          authorId: input.authorId,
          type: TicketActivityType.Commented,
          extraInfo: {
            comment: input.content,
          } satisfies TicketCommented,
          createdAt: newComment.createdAt,
        });

        return {
          id: newComment.id,
        };
      });
    }),
});
