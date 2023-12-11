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
  oldAssignedTo?: InferSelectModel<typeof schema.customers> | null;
  newAssignedTo?: InferSelectModel<typeof schema.customers> | null;
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
      const augmentedTicketActivities: (Omit<
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

      const customers =
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

      ticketTimelineEntries.forEach((ticketActivity) => {
        switch (ticketActivity.type) {
          case TicketTimelineEntryType.AssignmentChanged:
            augmentedTicketActivities.push({
              ...ticketActivity,
              entry: {
                ...(ticketActivity.entry as TicketAssignmentChanged),
                oldAssignedTo:
                  customers.find(
                    (customer) =>
                      customer.id ===
                      (ticketActivity.entry as TicketAssignmentChanged)
                        .oldAssignedToId
                  ) ?? null,
                newAssignedTo:
                  customers.find(
                    (customer) =>
                      customer.id ===
                      (ticketActivity.entry as TicketAssignmentChanged)
                        .newAssignedToId
                  ) ?? null,
              },
            });
            break;
          case TicketTimelineEntryType.Note:
            augmentedTicketActivities.push({
              ...ticketActivity,
              entry: ticketActivity.entry as TicketNote,
            });
            break;
          case TicketTimelineEntryType.LabelsChanged:
            augmentedTicketActivities.push({
              ...ticketActivity,
              entry: {
                ...(ticketActivity.entry as TicketLabelsChanged),
                oldLabels: labels.filter((label) =>
                  (
                    ticketActivity.entry as TicketLabelsChanged
                  ).oldLabelIds.includes(label.id)
                ),
                newLabels: labels.filter((label) =>
                  (
                    ticketActivity.entry as TicketLabelsChanged
                  ).newLabelIds.includes(label.id)
                ),
              },
            });
            break;
          case TicketTimelineEntryType.PriorityChanged:
            augmentedTicketActivities.push({
              ...ticketActivity,
              entry: ticketActivity.entry as TicketPriorityChanged,
            });
            break;
          case TicketTimelineEntryType.StatusChanged:
            augmentedTicketActivities.push({
              ...ticketActivity,
              entry: ticketActivity.entry as TicketStatusChanged,
            });
            break;
          default:
            augmentedTicketActivities.push({ ...ticketActivity });
        }
      });

      return augmentedTicketActivities;
    }),
});
