import { relations } from 'drizzle-orm';
import { pgEnum, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { ChatContentType, ChatDirection, ChatStatus } from '@cs/lib/chats';
import { generateEntityId } from '@cs/lib/generate-entity-id';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';

export const chatDirection = pgEnum('chatDirection', [
  ChatDirection.Outbound,
  ChatDirection.Inbound,
]);
export const chatContentType = pgEnum('chatContentType', [
  ChatContentType.TextHtml,
  ChatContentType.TextJson,
  ChatContentType.TextPlain,
]);
export const chatStatus = pgEnum('chatStatus', [
  ChatStatus.Seen,
  ChatStatus.DeliveredToDevice,
  ChatStatus.DeliveredToCloud,
  ChatStatus.Sent,
  ChatStatus.Pending,
]);

export const ticketChats = pgTable('ticketChat', {
  id: varchar('id').primaryKey().notNull().default(generateEntityId('', 'ms')),
  status: chatStatus('status').notNull(),
  contentType: chatContentType('contentType').notNull(),
  content: text('content').notNull(),
  direction: chatDirection('direction').notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  createdById: varchar('createdById')
    .notNull()
    .references(() => contacts.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  ticketId: varchar('ticketId')
    .notNull()
    .references(() => tickets.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});

export const chatsRelations = relations(ticketChats, ({ one }) => ({
  createdBy: one(contacts, {
    fields: [ticketChats.createdById],
    references: [contacts.id],
  }),
  ticket: one(tickets, {
    fields: [ticketChats.ticketId],
    references: [tickets.id],
  }),
}));
