import { integer, serial, text, timestamp } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { contact } from './contact';

export const ticket = pgTable('Ticket', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  content: text('content'),
  contactId: integer('contactId')
    .notNull()
    .references(() => contact.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});
