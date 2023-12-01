import { relations } from 'drizzle-orm';
import { unique, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';

import { pgTable } from './_table';
import { labelTypes } from './labelType';
import { tickets } from './ticket';

export const labels = pgTable(
  'label',
  {
    id: varchar('id')
      .primaryKey()
      .notNull()
      .default(generateEntityId('', 'lb')),
    ticketId: varchar('ticketId')
      .notNull()
      .references(() => tickets.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    labelTypeId: varchar('labelTypeId')
      .notNull()
      .references(() => labelTypes.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
  },
  (table) => ({
    unique: unique().on(table.ticketId, table.labelTypeId),
  })
);

export const labelsRelations = relations(labels, ({ one }) => ({
  ticket: one(tickets, {
    fields: [labels.ticketId],
    references: [tickets.id],
  }),
  labelType: one(labelTypes, {
    fields: [labels.labelTypeId],
    references: [labelTypes.id],
  }),
}));
