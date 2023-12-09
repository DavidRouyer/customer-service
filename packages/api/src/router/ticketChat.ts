import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { eq, schema } from '@cs/database';
import { TicketStatusDetail } from '@cs/lib/tickets';
import {
  TicketChat,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketChatRouter = createTRPCRouter({
  sendChat: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        ticketId: z.string().min(1),
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

        const newChat = await tx
          .insert(schema.ticketTimelineEntries)
          .values({
            ticketId: input.ticketId,
            type: TicketTimelineEntryType.Chat,
            entry: {
              text: input.text,
            } satisfies TicketChat,
            customerId: ticket.customerId,
            createdAt: creationDate,
            userCreatedById: ctx.session.user.id,
          })
          .returning({
            id: schema.ticketTimelineEntries.id,
            createdAt: schema.ticketTimelineEntries.createdAt,
          })
          .then((res) => res[0]);

        if (!newChat) {
          tx.rollback();
          return;
        }

        await tx
          .update(schema.tickets)
          .set({
            statusDetail: TicketStatusDetail.Replied,
            statusChangedAt: newChat.createdAt,
            statusChangedById: ctx.session.user.id,
            updatedAt: newChat.createdAt,
            updatedById: ctx.session.user.id,
          })
          .where(eq(schema.tickets.id, input.ticketId));

        return {
          id: newChat.id,
        };
      });
    }),
});
