import { integer, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { contacts } from './contact';

export const labelTypes = pgTable('LabelType', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  icon: varchar('icon', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }),
  archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
  authorId: integer('authorId')
    .notNull()
    .references(() => contacts.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});
