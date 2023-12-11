import { relations } from 'drizzle-orm';
import { text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';

import { pgTable } from './_table';
import { users } from './auth';
import { tickets } from './ticket';

export const customers = pgTable('customer', {
  id: varchar('id').primaryKey().notNull().default(generateEntityId('', 'co')),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  email: text('email'),
  name: text('name'),
  phone: text('phone'),
  avatarUrl: text('avatarUrl'),
  language: text('language'),
  timezone: text('timezone'),
  userId: text('userId'),
});

export const customersRelations = relations(customers, ({ one, many }) => ({
  tickets: many(tickets),
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}));