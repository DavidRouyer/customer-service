import { z } from 'zod';

import { asc, eq, inArray, InferSelectModel, schema } from '@cs/database';
import {
  TicketAssignmentChanged,
  TicketChat,
  TicketLabelsChanged,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export type TicketAssignmentChangedWithData = {
  oldAssignedTo?: InferSelectModel<typeof schema.users> | null;
  newAssignedTo?: InferSelectModel<typeof schema.users> | null;
} & TicketAssignmentChanged;

export type TicketLabelsChangedWithData = {
  oldLabels?: (InferSelectModel<typeof schema.labels> & {
    labelType: InferSelectModel<typeof schema.labelTypes>;
  })[];
  newLabels?: (InferSelectModel<typeof schema.labels> & {
    labelType: InferSelectModel<typeof schema.labelTypes>;
  })[];
} & TicketLabelsChanged;

export const ticketTimelineRouter = createTRPCRouter({
  byTicketId: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticketTimelineEntries =
        await ctx.db.query.ticketTimelineEntries.findMany({
          orderBy: asc(schema.ticketTimelineEntries.createdAt),
          where: eq(schema.ticketTimelineEntries.ticketId, input.ticketId),
          with: { customerCreatedBy: true, userCreatedBy: true },
        });
      const augmentedTicketTimelineEntries: (Omit<
        (typeof ticketTimelineEntries)[0],
        'entry'
      > & {
        entry:
          | TicketAssignmentChangedWithData
          | TicketChat
          | TicketLabelsChangedWithData
          | TicketNote
          | TicketPriorityChanged
          | TicketStatusChanged
          | null;
      })[] = [];

      const usersToFetch = new Set<string>();
      const labelsToFetch = new Set<string>();
      ticketTimelineEntries.forEach((ticketTimelineEntry) => {
        if (
          ticketTimelineEntry.type === TicketTimelineEntryType.AssignmentChanged
        ) {
          const extraInfo =
            ticketTimelineEntry.entry as TicketAssignmentChanged;
          if (extraInfo.oldAssignedToId !== null)
            usersToFetch.add(extraInfo.oldAssignedToId);
          if (extraInfo.newAssignedToId !== null)
            usersToFetch.add(extraInfo.newAssignedToId);
        }
        if (
          ticketTimelineEntry.type === TicketTimelineEntryType.LabelsChanged
        ) {
          const extraInfo = ticketTimelineEntry.entry as TicketLabelsChanged;
          extraInfo.oldLabelIds.forEach((labelId) => {
            labelsToFetch.add(labelId);
          });
          extraInfo.newLabelIds.forEach((labelId) => {
            labelsToFetch.add(labelId);
          });
        }
      });

      const users =
        usersToFetch.size > 0
          ? await ctx.db.query.users.findMany({
              where: inArray(schema.users.id, [...usersToFetch]),
            })
          : [];

      const labels =
        labelsToFetch.size > 0
          ? await ctx.db.query.labels.findMany({
              where: inArray(schema.labelTypes.id, [...labelsToFetch]),
              with: { labelType: true },
            })
          : [];

      ticketTimelineEntries.forEach((ticketTimelineEntry) => {
        switch (ticketTimelineEntry.type) {
          case TicketTimelineEntryType.AssignmentChanged:
            augmentedTicketTimelineEntries.push({
              ...ticketTimelineEntry,
              entry: {
                ...(ticketTimelineEntry.entry as TicketAssignmentChanged),
                oldAssignedTo:
                  users.find(
                    (user) =>
                      user.id ===
                      (ticketTimelineEntry.entry as TicketAssignmentChanged)
                        .oldAssignedToId
                  ) ?? null,
                newAssignedTo:
                  users.find(
                    (user) =>
                      user.id ===
                      (ticketTimelineEntry.entry as TicketAssignmentChanged)
                        .newAssignedToId
                  ) ?? null,
              },
            });
            break;
          case TicketTimelineEntryType.Note:
            augmentedTicketTimelineEntries.push({
              ...ticketTimelineEntry,
              entry: ticketTimelineEntry.entry as TicketNote,
            });
            break;
          case TicketTimelineEntryType.LabelsChanged:
            augmentedTicketTimelineEntries.push({
              ...ticketTimelineEntry,
              entry: {
                ...(ticketTimelineEntry.entry as TicketLabelsChanged),
                oldLabels: labels.filter((label) =>
                  (
                    ticketTimelineEntry.entry as TicketLabelsChanged
                  ).oldLabelIds.includes(label.id)
                ),
                newLabels: labels.filter((label) =>
                  (
                    ticketTimelineEntry.entry as TicketLabelsChanged
                  ).newLabelIds.includes(label.id)
                ),
              },
            });
            break;
          case TicketTimelineEntryType.PriorityChanged:
            augmentedTicketTimelineEntries.push({
              ...ticketTimelineEntry,
              entry: ticketTimelineEntry.entry as TicketPriorityChanged,
            });
            break;
          case TicketTimelineEntryType.StatusChanged:
            augmentedTicketTimelineEntries.push({
              ...ticketTimelineEntry,
              entry: ticketTimelineEntry.entry as TicketStatusChanged,
            });
            break;
          default:
            augmentedTicketTimelineEntries.push({ ...ticketTimelineEntry });
        }
      });

      return augmentedTicketTimelineEntries;
    }),
});
