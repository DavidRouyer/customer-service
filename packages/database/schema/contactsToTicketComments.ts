import { pgTable, serial } from 'drizzle-orm/pg-core';

import { contacts } from './contact';
import { ticketComments } from './ticketComment';

export const contactsToTicketComments = pgTable('contactsToTicketComments', {
  contactId: serial('contactId')
    .notNull()
    .references(() => contacts.id),
  ticketCommentId: serial('commentId')
    .notNull()
    .references(() => ticketComments.id),
});
