import { relations } from 'drizzle-orm';
import { jsonb, timestamp, varchar } from 'drizzle-orm/pg-core';
import { SerializedEditorState } from 'lexical';

import { generateEntityId } from '@cs/lib/generate-entity-id';

import { pgTable } from './_table';
import { users } from './auth';
import { tickets } from './ticket';

export const ticketNotes = pgTable('ticketNote', {
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
    .references(() => users.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});

export const ticketNotesRelations = relations(ticketNotes, ({ one }) => ({
  createdBy: one(users, {
    fields: [ticketNotes.createdById],
    references: [users.id],
  }),
  ticket: one(tickets, {
    fields: [ticketNotes.ticketId],
    references: [tickets.id],
  }),
}));
