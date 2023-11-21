import { timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';

import { pgTable } from './_table';
import { contacts } from './contact';

export const labelTypes = pgTable('labelType', {
  id: varchar('id').primaryKey().notNull().default(generateEntityId('', 'lt')),
  name: varchar('name', { length: 256 }).notNull(),
  icon: varchar('icon', { length: 256 }).notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }),
  archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  createdById: varchar('createdById')
    .notNull()
    .references(() => contacts.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});
