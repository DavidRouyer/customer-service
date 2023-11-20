import { relations } from 'drizzle-orm';
import { integer, jsonb, serial, timestamp } from 'drizzle-orm/pg-core';
import { SerializedEditorState } from 'lexical';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';

export const ticketComments = pgTable('TicketComment', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  content: jsonb('content').$type<SerializedEditorState>().notNull(),
  ticketId: integer('ticketId')
    .notNull()
    .references(() => tickets.id, {
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

export const ticketCommentsRelations = relations(ticketComments, ({ one }) => ({
  createdBy: one(contacts, {
    fields: [ticketComments.createdById],
    references: [contacts.id],
  }),
  ticket: one(tickets, {
    fields: [ticketComments.ticketId],
    references: [tickets.id],
  }),
}));
