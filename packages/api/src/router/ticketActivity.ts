import { z } from 'zod';

import { asc, eq, inArray, InferSelectModel, schema } from '@cs/database';
import {
  TicketActivityType,
  TicketAssignmentAdded,
  TicketAssignmentChanged,
  TicketAssignmentRemoved,
  TicketCommented,
} from '@cs/lib/ticketActivities';

import { createTRPCRouter, protectedProcedure } from '../trpc';

export type TicketAssignmentAddedWithData = {
  newAssignedTo?: InferSelectModel<typeof schema.contacts>;
} & TicketAssignmentAdded;

export type TicketAssignmentChangedWithData = {
  oldAssignedTo?: InferSelectModel<typeof schema.contacts>;
  newAssignedTo?: InferSelectModel<typeof schema.contacts>;
} & TicketAssignmentChanged;

export type TicketAssignmentRemovedWithData = {
  oldAssignedTo?: InferSelectModel<typeof schema.contacts>;
} & TicketAssignmentRemoved;

export const ticketActivityRouter = createTRPCRouter({
  byTicketId: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(async ({ ctx, input }) => {
      const ticketActivities = await ctx.db.query.ticketActivities.findMany({
        orderBy: asc(schema.ticketActivities.createdAt),
        where: eq(schema.ticketActivities.ticketId, input.ticketId),
        with: { author: true },
      });
      const augmentedTicketActivities: (Omit<
        (typeof ticketActivities)[0],
        'extraInfo'
      > & {
        extraInfo:
          | TicketAssignmentAddedWithData
          | TicketAssignmentChangedWithData
          | TicketAssignmentRemovedWithData
          | TicketCommented
          | null;
      })[] = [];

      const contactsToFetch = new Set<number>();
      ticketActivities.forEach((ticketActivity) => {
        if (ticketActivity.type === TicketActivityType.AssignmentAdded) {
          contactsToFetch.add(
            (ticketActivity.extraInfo as TicketAssignmentAdded).newAssignedToId
          );
        }
        if (ticketActivity.type === TicketActivityType.AssignmentChanged) {
          contactsToFetch.add(
            (ticketActivity.extraInfo as TicketAssignmentChanged)
              .oldAssignedToId
          );
          contactsToFetch.add(
            (ticketActivity.extraInfo as TicketAssignmentChanged)
              .newAssignedToId
          );
        }
        if (ticketActivity.type === TicketActivityType.AssignmentRemoved) {
          contactsToFetch.add(
            (ticketActivity.extraInfo as TicketAssignmentRemoved)
              .oldAssignedToId
          );
        }
      });
      const contacts =
        contactsToFetch.size > 0
          ? await ctx.db.query.contacts.findMany({
              where: inArray(schema.contacts.id, [...contactsToFetch]),
            })
          : [];

      ticketActivities.forEach((ticketActivity) => {
        switch (ticketActivity.type) {
          case TicketActivityType.AssignmentAdded:
            augmentedTicketActivities.push({
              ...ticketActivity,
              extraInfo: {
                ...(ticketActivity.extraInfo as TicketAssignmentAdded),
                newAssignedTo: contacts.find(
                  (contact) =>
                    contact.id ===
                    (ticketActivity.extraInfo as TicketAssignmentAdded)
                      .newAssignedToId
                ),
              },
            });
            break;
          case TicketActivityType.AssignmentChanged:
            augmentedTicketActivities.push({
              ...ticketActivity,
              extraInfo: {
                ...(ticketActivity.extraInfo as TicketAssignmentChanged),
                oldAssignedTo: contacts.find(
                  (contact) =>
                    contact.id ===
                    (ticketActivity.extraInfo as TicketAssignmentChanged)
                      .oldAssignedToId
                ),
                newAssignedTo: contacts.find(
                  (contact) =>
                    contact.id ===
                    (ticketActivity.extraInfo as TicketAssignmentChanged)
                      .newAssignedToId
                ),
              },
            });
            break;
          case TicketActivityType.AssignmentRemoved:
            augmentedTicketActivities.push({
              ...ticketActivity,
              extraInfo: {
                ...(ticketActivity.extraInfo as TicketAssignmentRemoved),
                oldAssignedTo: contacts.find(
                  (contact) =>
                    contact.id ===
                    (ticketActivity.extraInfo as TicketAssignmentRemoved)
                      .oldAssignedToId
                ),
              },
            });
            break;
          case TicketActivityType.Commented:
            augmentedTicketActivities.push({
              ...ticketActivity,
              extraInfo: ticketActivity.extraInfo as TicketCommented,
            });
            break;
          default:
            augmentedTicketActivities.push({ ...ticketActivity });
        }
      });

      return augmentedTicketActivities;
    }),
});
