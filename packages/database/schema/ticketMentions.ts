import { relations } from 'drizzle-orm';
import { primaryKey, varchar } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { users } from './auth';
import { customers } from './customer';
import { tickets } from './ticket';
import { ticketTimelineEntries } from './ticketTimelineEntry';

export const ticketMentions = pgTable(
  'ticketMentions',
  {
    contactId: varchar('contactId')
      .notNull()
      .references(() => customers.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    ticketTimelineEntryId: varchar('ticketTimelineEntryId')
      .notNull()
      .references(() => ticketTimelineEntries.id, {
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
        columns: [table.contactId, table.ticketTimelineEntryId],
      }),
    };
  }
);

export const ticketMentionsRelations = relations(ticketMentions, ({ one }) => ({
  user: one(users, {
    fields: [ticketMentions.contactId],
    references: [users.id],
  }),
  ticketTimelineEntry: one(ticketTimelineEntries, {
    fields: [ticketMentions.ticketTimelineEntryId],
    references: [ticketTimelineEntries.id],
  }),
  ticket: one(tickets, {
    fields: [ticketMentions.ticketId],
    references: [tickets.id],
  }),
}));
