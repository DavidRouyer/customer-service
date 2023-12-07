import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { asc, eq, schema } from '@cs/database';
import { ChatDirection, ChatStatus } from '@cs/lib/chats';
import { TicketStatusDetail } from '@cs/lib/tickets';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketChatRouter = createTRPCRouter({
  byTicketId: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.ticketChats.findMany({
        where: eq(schema.ticketChats.ticketId, input.ticketId),
        orderBy: asc(schema.ticketChats.createdAt),
        with: { createdBy: true },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        contentType: z.enum(schema.ticketChats.contentType.enumValues),
        direction: z.enum(schema.ticketChats.direction.enumValues),
        ticketId: z.string(),
        status: z.enum(schema.ticketChats.status.enumValues),
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
          .insert(schema.ticketChats)
          .values({
            ...input,
            status: ChatStatus.DeliveredToCloud,
            createdAt: creationDate,
            createdById: ctx.session.user.id,
          })
          .returning({
            id: schema.ticketChats.id,
            createdAt: schema.ticketChats.createdAt,
          })
          .then((res) => res[0]);

        if (!newChat) {
          tx.rollback();
          return;
        }

        await tx
          .update(schema.tickets)
          .set({
            statusDetail:
              input.direction === ChatDirection.Inbound
                ? TicketStatusDetail.NewReply
                : TicketStatusDetail.Replied,
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
