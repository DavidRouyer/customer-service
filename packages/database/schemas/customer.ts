import { relations } from 'drizzle-orm';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/kyaku/utils';

import { users } from './auth';
import { lifecycleFields } from './common';
import { tickets } from './ticket';

export const customers = pgTable('customer', {
  id: varchar('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateEntityId('', 'co')),
  email: text('email'),
  name: text('name'),
  phone: text('phone'),
  avatarUrl: text('avatarUrl'),
  language: text('language'),
  timezone: text('timezone'),
  ...lifecycleFields,
});

export const customersRelations = relations(customers, ({ one, many }) => ({
  tickets: many(tickets),
  createdBy: one(users, {
    fields: [customers.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [customers.updatedById],
    references: [users.id],
  }),
}));
