import { relations } from 'drizzle-orm';
import { jsonb, timestamp, varchar } from 'drizzle-orm/pg-core';
import { SerializedEditorState } from 'lexical';

import { generateEntityId } from '@cs/lib/generate-entity-id';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';

export const ticketComments = pgTable('ticketComment', {
  id: varchar('id').primaryKey().notNull().default(generateEntityId('', 'tc')),
  content: jsonb('content').$type<SerializedEditorState>().notNull(),
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
