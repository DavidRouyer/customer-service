import { relations } from 'drizzle-orm';
import { integer, json, pgEnum, serial, timestamp } from 'drizzle-orm/pg-core';

import {
  TicketActivityType,
  TicketAssignmentAdded,
  TicketAssignmentChanged,
  TicketAssignmentRemoved,
  TicketCommented,
} from '@cs/lib/ticketActivities';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';

export const ticketStatus = pgEnum('TicketActivityType', [
  TicketActivityType.AssignmentAdded,
  TicketActivityType.AssignmentChanged,
  TicketActivityType.AssignmentRemoved,
  TicketActivityType.Commented,
  TicketActivityType.Created,
  TicketActivityType.PriorityAdded,
  TicketActivityType.PriorityRemoved,
  TicketActivityType.Resolved,
  TicketActivityType.Reopened,
]);

export const ticketActivities = pgTable('TicketActivity', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  type: ticketStatus('type').notNull(),
  extraInfo: json('extraInfo').$type<
    | TicketAssignmentAdded
    | TicketAssignmentChanged
    | TicketAssignmentRemoved
    | TicketCommented
  >(),
  ticketId: integer('ticketId')
    .notNull()
    .references(() => tickets.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  authorId: integer('authorId')
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
    author: one(contacts, {
      fields: [ticketActivities.authorId],
      references: [contacts.id],
    }),
  })
);
