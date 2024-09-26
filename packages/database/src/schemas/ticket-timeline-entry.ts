import { relations } from 'drizzle-orm';
import { json, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

import type {
  TicketAssignmentChanged,
  TicketChat,
  TicketLabelsChanged,
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
} from '@kyaku/kyaku/models';
import { TimelineEntryType } from '@kyaku/kyaku/models';

import { generateEntityId } from '../../../kyaku/src/utils';
import { users } from './auth';
import { customers } from './customer';
import { tickets } from './ticket';

export const ticketTimelineEntryType = pgEnum('ticketTimelineEntryType', [
  TimelineEntryType.AssignmentChanged,
  TimelineEntryType.Chat,
  TimelineEntryType.LabelsChanged,
  TimelineEntryType.Note,
  TimelineEntryType.PriorityChanged,
  TimelineEntryType.StatusChanged,
]);

export const ticketTimelineEntries = pgTable('ticketTimelineEntry', {
  id: varchar('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateEntityId('', 'te')),
  type: ticketTimelineEntryType('type').notNull(),
  entry: json('entry')
    .notNull()
    .$type<
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
