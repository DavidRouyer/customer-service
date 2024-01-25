import { relations } from 'drizzle-orm';
import { pgTable, timestamp, unique, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/kyaku/utils/generate-entity-id';

import { labelTypes } from './label-type';
import { tickets } from './ticket';

export const labels = pgTable(
  'label',
  {
    id: varchar('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => generateEntityId('', 'lb')),
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
    archivedAt: timestamp('archivedAt', { precision: 3, mode: 'date' }),
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
