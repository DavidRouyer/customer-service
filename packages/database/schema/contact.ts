import { relations } from 'drizzle-orm';
import { serial, text, timestamp } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { tickets } from './ticket';

export const contacts = pgTable('Contact', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  email: text('email'),
  name: text('name'),
  phone: text('phone'),
  avatarUrl: text('avatarUrl'),
  language: text('language'),
  timezone: text('timezone'),
});

export const contactsRelations = relations(contacts, ({ many }) => ({
  tickets: many(tickets),
}));
