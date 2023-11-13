import { relations } from 'drizzle-orm';
import { primaryKey, serial } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { labelTypes } from './labelType';
import { tickets } from './ticket';

export const labels = pgTable(
  'labels',
  {
    ticketId: serial('ticketId')
      .notNull()
      .references(() => tickets.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
    labelTypeId: serial('labelTypeId')
      .notNull()
      .references(() => labelTypes.id, {
        onDelete: 'restrict',
        onUpdate: 'cascade',
      }),
  },
  (table) => {
    return {
      pk: primaryKey({
        name: 'label_pk',
        columns: [table.ticketId, table.labelTypeId],
      }),
    };
  }
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
