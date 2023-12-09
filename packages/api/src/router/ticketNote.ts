import { TRPCError } from '@trpc/server';
import { SerializedEditorState } from 'lexical';
import { z } from 'zod';

import { eq, schema } from '@cs/database';
import { extractMentions } from '@cs/lib/editor';
import {
  TicketNote,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export const ticketNoteRouter = createTRPCRouter({
  sendNote: protectedProcedure
    .input(
      z
        .object({
          text: z.string().min(1),
          ticketId: z.string().min(1),
        })
        .refine(
          (v) => {
            try {
              JSON.parse(v.text);
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

      const content = JSON.parse(input.text) as SerializedEditorState;
      const mentionIds = extractMentions(content);

      return await ctx.db.transaction(async (tx) => {
        const creationDate = new Date();

        const newNote = await tx
          .insert(schema.ticketTimelineEntries)
          .values({
            ticketId: input.ticketId,
            type: TicketTimelineEntryType.Note,
            entry: {
              text: input.text,
            } satisfies TicketNote,
            customerId: ticket.customerId,
            createdAt: creationDate,
            userCreatedById: ctx.session.user.id,
          })
          .returning({
            id: schema.ticketTimelineEntries.id,
            createdAt: schema.ticketTimelineEntries.createdAt,
          })
          .then((res) => res[0]);

        if (!newNote) {
          tx.rollback();
          return;
        }

        if (mentionIds.length > 0) {
          await tx.insert(schema.ticketMentions).values(
            mentionIds.map((mentionId) => ({
              ticketTimelineEntryId: newNote.id,
              contactId: mentionId,
              ticketId: ticket.id,
            }))
          );
        }

        return {
          id: newNote.id,
        };
      });
    }),
});
