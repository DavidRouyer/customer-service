import { TRPCError } from '@trpc/server';
import { SerializedEditorState } from 'lexical';
import { z } from 'zod';

import { asc, eq, schema } from '@cs/database';
import { extractMentions } from '@cs/lib/editor';
import { TicketActivityType, TicketCommented } from '@cs/lib/ticketActivities';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketNoteRouter = createTRPCRouter({
  byTicketId: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.ticketNotes.findMany({
        orderBy: asc(schema.ticketNotes.createdAt),
        where: eq(schema.ticketNotes.ticketId, input.ticketId),
        with: { createdBy: true },
      });
    }),

  create: protectedProcedure
    .input(
      z
        .object({
          content: z.string().min(1),
          ticketId: z.string(),
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
        const creationDate = new Date();

        const newNote = await tx
          .insert(schema.ticketNotes)
          .values({
            ...input,
            content: content,
            createdAt: creationDate,
            createdById: ctx.session.user.id,
          })
          .returning({
            id: schema.ticketNotes.id,
            createdAt: schema.ticketNotes.createdAt,
          })
          .then((res) => res[0]);

        if (!newNote) {
          tx.rollback();
          return;
        }

        if (mentionIds.length > 0) {
          await tx.insert(schema.ticketMentions).values(
            mentionIds.map((mentionId) => ({
              ticketNoteId: newNote.id,
              contactId: mentionId,
              ticketId: ticket.id,
            }))
          );
        }

        await tx.insert(schema.ticketActivities).values({
          ticketId: input.ticketId,
          type: TicketActivityType.Commented,
          extraInfo: {
            text: input.content,
          } satisfies TicketCommented,
          createdAt: newNote.createdAt,
          createdById: ctx.session.user.id,
        });

        return {
          id: newNote.id,
        };
      });
    }),
});
