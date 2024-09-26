import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@kyaku/kyaku/utils';

import { users } from './auth';
import { lifecycleFields } from './common';

export const labelTypes = pgTable('labelType', {
  id: varchar('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateEntityId('', 'lt')),
  name: varchar('name', { length: 256 }).notNull(),
  icon: varchar('icon', { length: 256 }),
  archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
  ...lifecycleFields,
});

export const labelTypesRelations = relations(labelTypes, ({ one }) => ({
  createdBy: one(users, {
    fields: [labelTypes.createdById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [labelTypes.updatedById],
    references: [users.id],
  }),
}));
