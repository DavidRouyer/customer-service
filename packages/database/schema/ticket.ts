import { relations } from 'drizzle-orm';
import { pgEnum, timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';
import {
  TicketPriority,
  TicketStatus,
  TicketStatusDetail,
} from '@cs/lib/tickets';

import { pgTable } from './_table';
import { contacts } from './contact';
import { contactsToTicketComments } from './contactsToTicketComments';
import { labels } from './label';
import { messages } from './message';

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
  id: varchar('id').primaryKey().notNull().default(generateEntityId('', 'ti')),
  title: varchar('title'),
  status: ticketStatus('status').notNull(),
  statusDetail: ticketStatusDetail('statusDetail'),
  statusChangedAt: timestamp('statusChangedAt', { precision: 3, mode: 'date' }),
  statusChangedById: varchar('statusChangedById').references(
    () => contacts.id,
    {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }
  ),
  priority: ticketPriority('priority').notNull(),
  assignedToId: varchar('assignedToId').references(() => contacts.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  createdById: varchar('createdById')
    .notNull()
    .references(() => contacts.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'date' }),
  updatedById: varchar('updatedById').references(() => contacts.id, {
    onDelete: 'restrict',
    onUpdate: 'cascade',
  }),
});

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  assignedTo: one(contacts, {
    fields: [tickets.assignedToId],
    references: [contacts.id],
  }),
  statusChangedBy: one(contacts, {
    fields: [tickets.statusChangedById],
    references: [contacts.id],
  }),
  createdBy: one(contacts, {
    fields: [tickets.createdById],
    references: [contacts.id],
  }),
  updatedBy: one(contacts, {
    fields: [tickets.updatedById],
    references: [contacts.id],
  }),
  messages: many(messages),
  contactsToTicketComments: many(contactsToTicketComments),
  labels: many(labels),
}));
