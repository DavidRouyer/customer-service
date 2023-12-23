import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, varchar } from 'drizzle-orm/pg-core';

import { users } from './auth';
import { tickets } from './ticket';
import { ticketTimelineEntries } from './ticketTimelineEntry';

export const ticketMentions = pgTable(
  'ticketMentions',
  {
    userId: varchar('userId')
      .notNull()
      .references(() => users.id, {
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
        columns: [table.userId, table.ticketTimelineEntryId],
      }),
    };
  }
);

export const ticketMentionsRelations = relations(ticketMentions, ({ one }) => ({
  user: one(users, {
    fields: [ticketMentions.userId],
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
