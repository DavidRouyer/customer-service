import { relations } from 'drizzle-orm';
import { json, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';
import {
  TicketAssignmentChanged,
  TicketChat,
  TicketLabelsChanged,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';

import { users } from './auth';
import { customers } from './customer';
import { tickets } from './ticket';

export const ticketTimelineEntryType = pgEnum('ticketTimelineEntryType', [
  TicketTimelineEntryType.AssignmentChanged,
  TicketTimelineEntryType.Chat,
  TicketTimelineEntryType.LabelsChanged,
  TicketTimelineEntryType.Note,
  TicketTimelineEntryType.PriorityChanged,
  TicketTimelineEntryType.StatusChanged,
]);

export const ticketTimelineEntries = pgTable('ticketTimelineEntry', {
  id: varchar('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateEntityId('', 'te')),
  type: ticketTimelineEntryType('type').notNull(),
  entry: json('entry').$type<
    | TicketAssignmentChanged
    | TicketChat
    | TicketLabelsChanged
    | TicketNote
    | TicketPriorityChanged
    | TicketStatusChanged
  >(),
  ticketId: varchar('ticketId')
    .notNull()
    .references(() => tickets.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  customerId: varchar('customerId')
    .notNull()
    .references(() => customers.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  customerCreatedById: varchar('customerCreatedById').references(
    () => customers.id,
    {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }
  ),
  userCreatedById: varchar('userCreatedById').references(() => users.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
});

export const ticketTimelineEntriesRelations = relations(
  ticketTimelineEntries,
  ({ one }) => ({
    customer: one(customers, {
      fields: [ticketTimelineEntries.customerId],
      references: [customers.id],
    }),
    customerCreatedBy: one(customers, {
      fields: [ticketTimelineEntries.customerCreatedById],
      references: [customers.id],
    }),
    userCreatedBy: one(users, {
      fields: [ticketTimelineEntries.userCreatedById],
      references: [users.id],
    }),
    ticket: one(tickets, {
      fields: [ticketTimelineEntries.ticketId],
      references: [tickets.id],
    }),
  })
);
