import { TRPCError } from '@trpc/server';
import { SerializedEditorState } from 'lexical';
import { z } from 'zod';

import { asc, eq, schema } from '@cs/database';
import { extractMentions } from '@cs/lib/editor';
import { TicketActivityType, TicketCommented } from '@cs/lib/ticketActivities';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketCommentRouter = createTRPCRouter({
  byTicketId: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.ticketComments.findMany({
        orderBy: asc(schema.ticketComments.createdAt),
        where: eq(schema.ticketComments.ticketId, input.ticketId),
        with: { createdBy: true },
      });
    }),

  create: protectedProcedure
    .input(
      z
        .object({
          content: z.string().min(1),
          createdAt: z.date(),
          createdById: z.number(),
          ticketId: z.number(),
        })
        .refine(
          (v) => {
            try {
              JSON.parse(v.content);
              return true;
            } catch (e) {
              return false;
            }
          },
          {
            path: ['content'],
            message: 'content must be a valid JSON string',
          }
        )
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

      const content = JSON.parse(input.content) as SerializedEditorState;
      const mentionIds = extractMentions(content);

      return await ctx.db.transaction(async (tx) => {
        const newComment = await tx
          .insert(schema.ticketComments)
          .values({
            ...input,
            content: content,
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

        if (mentionIds.length > 0) {
          await tx.insert(schema.contactsToTicketComments).values(
            mentionIds.map((mentionId) => ({
              ticketCommentId: newComment.id,
              contactId: mentionId,
              ticketId: ticket.id,
            }))
          );
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.ticketId,
          createdById: input.createdById,
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
