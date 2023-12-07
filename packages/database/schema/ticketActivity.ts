import { relations } from 'drizzle-orm';
import { json, pgEnum, timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';
import {
  TicketActivityType,
  TicketAssignmentChanged,
  TicketCommented,
  TicketLabelsChanged,
  TicketPriorityChanged,
} from '@cs/lib/ticketActivities';

import { pgTable } from './_table';
import { users } from './auth';
import { tickets } from './ticket';

export const ticketStatus = pgEnum('ticketActivityType', [
  TicketActivityType.AssignmentChanged,
  TicketActivityType.Commented,
  TicketActivityType.Created,
  TicketActivityType.LabelsChanged,
  TicketActivityType.PriorityChanged,
  TicketActivityType.Resolved,
  TicketActivityType.Reopened,
]);

export const ticketActivities = pgTable('ticketActivity', {
  id: varchar('id').primaryKey().notNull().default(generateEntityId('', 'ta')),
  type: ticketStatus('type').notNull(),
  extraInfo: json('extraInfo').$type<
    | TicketAssignmentChanged
    | TicketCommented
    | TicketLabelsChanged
    | TicketPriorityChanged
  >(),
  ticketId: varchar('ticketId')
    .notNull()
    .references(() => tickets.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  createdById: varchar('createdById')
    .notNull()
    .references(() => users.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});

export const ticketActivitiesRelations = relations(
  ticketActivities,
  ({ one }) => ({
    createdBy: one(users, {
      fields: [ticketActivities.createdById],
      references: [users.id],
    }),
    ticket: one(tickets, {
      fields: [ticketActivities.ticketId],
      references: [tickets.id],
    }),
  })
);
