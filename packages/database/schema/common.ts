import { timestamp, varchar } from 'drizzle-orm/pg-core';

import { users } from './auth';

export const lifecycleFields = {
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  createdById: varchar('createdById')
    .notNull()
    .references(() => users.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }),
  updatedById: varchar('updatedById').references(() => users.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
};
