import { relations } from 'drizzle-orm';
import { primaryKey, varchar } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';
import { ticketComments } from './ticketComment';

export const contactsToTicketComments = pgTable(
  'contactsToTicketComments',
  {
    contactId: varchar('contactId')
      .notNull()
      .references(() => contacts.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    ticketCommentId: varchar('ticketCommentId')
      .notNull()
      .references(() => ticketComments.id, {
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
        name: 'contactsToTicketComments_pk',
        columns: [table.contactId, table.ticketCommentId],
      }),
    };
  }
);

export const contactsToTicketCommentsRelations = relations(
  contactsToTicketComments,
  ({ one }) => ({
    contact: one(contacts, {
      fields: [contactsToTicketComments.contactId],
      references: [contacts.id],
    }),
    ticketComment: one(ticketComments, {
      fields: [contactsToTicketComments.ticketCommentId],
      references: [ticketComments.id],
    }),
    ticket: one(tickets, {
      fields: [contactsToTicketComments.ticketId],
      references: [tickets.id],
    }),
  })
);
