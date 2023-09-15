import { relations } from 'drizzle-orm';
import { integer, pgEnum, serial, text, timestamp } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { contacts } from './contact';
import { messages } from './message';

export enum TicketStatus {
  Open = 'Open',
  Resolved = 'Resolved',
}

export const ticketStatus = pgEnum('TicketStatus', [
  TicketStatus.Open,
  TicketStatus.Resolved,
]);

export const tickets = pgTable('Ticket', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }),
  resolvedAt: timestamp('resolvedAt', { precision: 3, mode: 'date' }),
  content: text('content'),
  status: ticketStatus('status').notNull(),
  assignedToId: integer('assignedToId').references(() => contacts.id, {
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

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  assignedTo: one(contacts, {
    fields: [tickets.assignedToId],
    references: [contacts.id],
  }),
  author: one(contacts, {
    fields: [tickets.authorId],
    references: [contacts.id],
  }),
  messages: many(messages),
}));
