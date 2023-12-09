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
      const ticketActivities =
        await ctx.db.query.ticketTimelineEntries.findMany({
          orderBy: asc(schema.ticketTimelineEntries.createdAt),
          where: eq(schema.ticketTimelineEntries.ticketId, input.ticketId),
          with: { customerCreatedBy: true, userCreatedBy: true },
        });
      const augmentedTicketActivities: (Omit<
        (typeof ticketActivities)[0],
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

      const customersToFetch = new Set<string>();
      const labelsToFetch = new Set<string>();
      ticketActivities.forEach((ticketActivity) => {
        if (ticketActivity.type === TicketTimelineEntryType.AssignmentChanged) {
          const extraInfo = ticketActivity.entry as TicketAssignmentChanged;
          if (extraInfo.oldAssignedToId !== null)
            customersToFetch.add(extraInfo.oldAssignedToId);
          if (extraInfo.newAssignedToId !== null)
            customersToFetch.add(extraInfo.newAssignedToId);
        }
        if (ticketActivity.type === TicketTimelineEntryType.LabelsChanged) {
          const extraInfo = ticketActivity.entry as TicketLabelsChanged;
          extraInfo.oldLabelIds.forEach((labelId) => {
            labelsToFetch.add(labelId);
          });
          extraInfo.newLabelIds.forEach((labelId) => {
            labelsToFetch.add(labelId);
          });
        }
      });

      const customers =
        customersToFetch.size > 0
          ? await ctx.db.query.customers.findMany({
              where: inArray(schema.customers.id, [...customersToFetch]),
            })
          : [];

      const labels =
        labelsToFetch.size > 0
          ? await ctx.db.query.labels.findMany({
              where: inArray(schema.labelTypes.id, [...labelsToFetch]),
              with: { labelType: true },
            })
          : [];

      ticketActivities.forEach((ticketActivity) => {
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
