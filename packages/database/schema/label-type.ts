import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';

import { users } from './auth';

export const labelTypes = pgTable('labelType', {
  id: varchar('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateEntityId('', 'lt')),
  name: varchar('name', { length: 256 }).notNull(),
  icon: varchar('icon', { length: 256 }).notNull(),
  archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
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
