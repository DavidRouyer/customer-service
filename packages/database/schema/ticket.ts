import { relations } from 'drizzle-orm';
import { integer, pgEnum, serial, timestamp } from 'drizzle-orm/pg-core';

import { TicketPriority, TicketStatus } from '@cs/lib/tickets';

import { pgTable } from './_table';
import { contacts } from './contact';
import { contactsToTicketComments } from './contactsToTicketComments';
import { labels } from './label';
import { messages } from './message';

export const ticketStatus = pgEnum('TicketStatus', [
  TicketStatus.Open,
  TicketStatus.Resolved,
]);

export const ticketPriority = pgEnum('TicketPriority', [
  TicketPriority.Critical,
  TicketPriority.High,
  TicketPriority.Medium,
  TicketPriority.Low,
]);

export const tickets = pgTable('Ticket', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }),
  resolvedAt: timestamp('resolvedAt', { precision: 3, mode: 'date' }),
  status: ticketStatus('status').notNull(),
  priority: ticketPriority('priority').notNull(),
  assignedToId: integer('assignedToId').references(() => contacts.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
  createdById: integer('createdById')
    .notNull()
    .references(() => contacts.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  assignedTo: one(contacts, {
    fields: [tickets.assignedToId],
    references: [contacts.id],
  }),
  createdBy: one(contacts, {
    fields: [tickets.createdById],
    references: [contacts.id],
  }),
  messages: many(messages),
  contactsToTicketComments: many(contactsToTicketComments),
  labels: many(labels),
}));
