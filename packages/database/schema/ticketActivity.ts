import { relations } from 'drizzle-orm';
import { json, pgEnum, timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';
import {
  TicketActivityType,
  TicketAssignmentAdded,
  TicketAssignmentChanged,
  TicketAssignmentRemoved,
  TicketCommented,
  TicketLabelAdded,
  TicketLabelRemoved,
  TicketPriorityChanged,
} from '@cs/lib/ticketActivities';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';

export const ticketStatus = pgEnum('ticketActivityType', [
  TicketActivityType.AssignmentAdded,
  TicketActivityType.AssignmentChanged,
  TicketActivityType.AssignmentRemoved,
  TicketActivityType.Commented,
  TicketActivityType.Created,
  TicketActivityType.LabelAdded,
  TicketActivityType.LabelRemoved,
  TicketActivityType.PriorityChanged,
  TicketActivityType.Resolved,
  TicketActivityType.Reopened,
]);

export const ticketActivities = pgTable('ticketActivity', {
  id: varchar('id').primaryKey().notNull().default(generateEntityId('', 'ta')),
  type: ticketStatus('type').notNull(),
  extraInfo: json('extraInfo').$type<
    | TicketAssignmentAdded
    | TicketAssignmentChanged
    | TicketAssignmentRemoved
    | TicketCommented
    | TicketLabelAdded
    | TicketLabelRemoved
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
    .references(() => contacts.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});

export const ticketActivitiesRelations = relations(
  ticketActivities,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketActivities.ticketId],
      references: [tickets.id],
    }),
    createdBy: one(contacts, {
      fields: [ticketActivities.createdById],
      references: [contacts.id],
    }),
  })
);
