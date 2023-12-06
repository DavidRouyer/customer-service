import { relations } from 'drizzle-orm';
import { primaryKey, varchar } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';
import { ticketNotes } from './ticketNote';

export const ticketMentions = pgTable(
  'ticketMentions',
  {
    contactId: varchar('contactId')
      .notNull()
      .references(() => contacts.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    ticketNoteId: varchar('ticketNoteId')
      .notNull()
      .references(() => ticketNotes.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    ticketId: varchar('ticketId')
      .notNull()
      .references(() => tickets.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'ticketMentions_pk',
        columns: [table.contactId, table.ticketNoteId],
      }),
    };
  }
);

export const ticketMentionsRelations = relations(ticketMentions, ({ one }) => ({
  contact: one(contacts, {
    fields: [ticketMentions.contactId],
    references: [contacts.id],
  }),
  ticketNote: one(ticketNotes, {
    fields: [ticketMentions.ticketNoteId],
    references: [ticketNotes.id],
  }),
  ticket: one(tickets, {
    fields: [ticketMentions.ticketId],
    references: [tickets.id],
  }),
}));
