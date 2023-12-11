import { relations } from 'drizzle-orm';
import { pgEnum, timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';
import {
  TicketPriority,
  TicketStatus,
  TicketStatusDetail,
} from '@cs/lib/tickets';

import { pgTable } from './_table';
import { users } from './auth';
import { customers } from './customer';
import { labels } from './label';
import { ticketMentions } from './ticketMentions';
import { ticketTimelineEntries } from './ticketTimelineEntry';

export const ticketStatus = pgEnum('ticketStatus', [
  TicketStatus.Open,
  TicketStatus.Done,
]);

export const ticketStatusDetail = pgEnum('ticketStatusDetail', [
  TicketStatusDetail.Created,
  TicketStatusDetail.NewReply,
  TicketStatusDetail.Replied,
]);

export const ticketPriority = pgEnum('ticketPriority', [
  TicketPriority.Critical,
  TicketPriority.High,
  TicketPriority.Medium,
  TicketPriority.Low,
]);

export const tickets = pgTable('ticket', {
  id: varchar('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateEntityId('', 'ti')),
  title: varchar('title'),
  status: ticketStatus('status').notNull(),
  statusDetail: ticketStatusDetail('statusDetail'),
  statusChangedAt: timestamp('statusChangedAt', { precision: 3, mode: 'date' }),
  statusChangedById: varchar('statusChangedById').references(() => users.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
  priority: ticketPriority('priority').notNull(),
  assignedToId: varchar('assignedToId').references(() => users.id, {
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

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  assignedTo: one(users, {
    fields: [tickets.assignedToId],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [tickets.customerId],
    references: [customers.id],
  }),
  createdBy: one(users, {
    fields: [tickets.createdById],
    references: [users.id],
  }),
  statusChangedBy: one(users, {
    fields: [tickets.statusChangedById],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [tickets.updatedById],
    references: [users.id],
  }),
  timeline: many(ticketTimelineEntries),
  ticketMentions: many(ticketMentions),
  labels: many(labels),
}));
