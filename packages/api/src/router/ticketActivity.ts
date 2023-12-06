import { z } from 'zod';

import { asc, eq, inArray, InferSelectModel, schema } from '@cs/database';
import {
  TicketActivityType,
  TicketAssignmentChanged,
  TicketCommented,
  TicketLabelsChanged,
  TicketPriorityChanged,
} from '@cs/lib/ticketActivities';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export type TicketAssignmentChangedWithData = {
  oldAssignedTo?: InferSelectModel<typeof schema.contacts> | null;
  newAssignedTo?: InferSelectModel<typeof schema.contacts> | null;
} & TicketAssignmentChanged;

export type TicketLabelsChangedWithData = {
  oldLabels?: (InferSelectModel<typeof schema.labels> & {
    labelType: InferSelectModel<typeof schema.labelTypes>;
  })[];
  newLabels?: (InferSelectModel<typeof schema.labels> & {
    labelType: InferSelectModel<typeof schema.labelTypes>;
  })[];
} & TicketLabelsChanged;

export const ticketActivityRouter = createTRPCRouter({
  byTicketId: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ticketActivities = await ctx.db.query.ticketActivities.findMany({
        orderBy: asc(schema.ticketActivities.createdAt),
        where: eq(schema.ticketActivities.ticketId, input.ticketId),
        with: { createdBy: true },
      });
      const augmentedTicketActivities: (Omit<
        (typeof ticketActivities)[0],
        'extraInfo'
      > & {
        extraInfo:
          | TicketAssignmentChangedWithData
          | TicketLabelsChangedWithData
          | TicketCommented
          | TicketPriorityChanged
          | null;
      })[] = [];

      const contactsToFetch = new Set<string>();
      const labelsToFetch = new Set<string>();
      ticketActivities.forEach((ticketActivity) => {
        if (ticketActivity.type === TicketActivityType.AssignmentChanged) {
          const extraInfo = ticketActivity.extraInfo as TicketAssignmentChanged;
          if (extraInfo.oldAssignedToId !== null)
            contactsToFetch.add(extraInfo.oldAssignedToId);
          if (extraInfo.newAssignedToId !== null)
            contactsToFetch.add(extraInfo.newAssignedToId);
        }
        if (ticketActivity.type === TicketActivityType.LabelsChanged) {
          const extraInfo = ticketActivity.extraInfo as TicketLabelsChanged;
          extraInfo.oldLabelIds.forEach((labelId) => {
            labelsToFetch.add(labelId);
          });
          extraInfo.newLabelIds.forEach((labelId) => {
            labelsToFetch.add(labelId);
          });
        }
      });

      const contacts =
        contactsToFetch.size > 0
          ? await ctx.db.query.contacts.findMany({
              where: inArray(schema.contacts.id, [...contactsToFetch]),
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
          case TicketActivityType.AssignmentChanged:
            augmentedTicketActivities.push({
              ...ticketActivity,
              extraInfo: {
                ...(ticketActivity.extraInfo as TicketAssignmentChanged),
                oldAssignedTo:
                  contacts.find(
                    (contact) =>
                      contact.id ===
                      (ticketActivity.extraInfo as TicketAssignmentChanged)
                        .oldAssignedToId
                  ) ?? null,
                newAssignedTo:
                  contacts.find(
                    (contact) =>
                      contact.id ===
                      (ticketActivity.extraInfo as TicketAssignmentChanged)
                        .newAssignedToId
                  ) ?? null,
              },
            });
            break;
          case TicketActivityType.Commented:
            augmentedTicketActivities.push({
              ...ticketActivity,
              extraInfo: ticketActivity.extraInfo as TicketCommented,
            });
            break;
          case TicketActivityType.LabelsChanged:
            augmentedTicketActivities.push({
              ...ticketActivity,
              extraInfo: {
                ...(ticketActivity.extraInfo as TicketLabelsChanged),
                oldLabels: labels.filter((label) =>
                  (
                    ticketActivity.extraInfo as TicketLabelsChanged
                  ).oldLabelIds.includes(label.id)
                ),
                newLabels: labels.filter((label) =>
                  (
                    ticketActivity.extraInfo as TicketLabelsChanged
                  ).newLabelIds.includes(label.id)
                ),
              },
            });
            break;
          case TicketActivityType.PriorityChanged:
            augmentedTicketActivities.push({
              ...ticketActivity,
              extraInfo: ticketActivity.extraInfo as TicketPriorityChanged,
            });
            break;
          default:
            augmentedTicketActivities.push({ ...ticketActivity });
        }
      });

      return augmentedTicketActivities;
    }),
});
