import { relations } from 'drizzle-orm';
import { integer, serial, text, timestamp } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { contacts } from './contact';
import { messages } from './message';

export const tickets = pgTable('Ticket', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  content: text('content'),
  contactId: integer('contactId')
    .notNull()
    .references(() => contacts.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [tickets.contactId],
    references: [contacts.id],
  }),
  messages: many(messages),
}));
