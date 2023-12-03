import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { asc, eq, schema } from '@cs/database';
import { MessageDirection, MessageStatus } from '@cs/lib/messages';
import { TicketStatusDetail } from '@cs/lib/tickets';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const messageRouter = createTRPCRouter({
  byTicketId: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.messages.findMany({
        where: eq(schema.messages.ticketId, input.ticketId),
        orderBy: asc(schema.messages.createdAt),
        with: { createdBy: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        contentType: z.enum(schema.messages.contentType.enumValues),
        direction: z.enum(schema.messages.direction.enumValues),
        ticketId: z.string(),
        status: z.enum(schema.messages.status.enumValues),
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
        const creationDate = new Date();

        const newMessage = await tx
          .insert(schema.messages)
          .values({
            ...input,
            status: MessageStatus.DeliveredToCloud,
            createdAt: creationDate,
            createdById: ctx.session.user.contactId ?? '',
          })
          .returning({
            id: schema.messages.id,
            createdAt: schema.messages.createdAt,
          })
          .then((res) => res[0]);

        if (!newMessage) {
          tx.rollback();
          return;
        }

        await tx
          .update(schema.tickets)
          .set({
            statusDetail:
              input.direction === MessageDirection.Inbound
                ? TicketStatusDetail.NewReply
                : TicketStatusDetail.Replied,
            statusChangedAt: newMessage.createdAt,
            statusChangedById: ctx.session.user.contactId ?? '',
            updatedAt: newMessage.createdAt,
            updatedById: ctx.session.user.contactId ?? '',
          })
          .where(eq(schema.tickets.id, input.ticketId));

        return {
          id: newMessage.id,
        };
      });
    }),
});
