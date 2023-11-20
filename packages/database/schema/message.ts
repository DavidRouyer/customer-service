import { relations } from 'drizzle-orm';
import { integer, pgEnum, serial, text, timestamp } from 'drizzle-orm/pg-core';

import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@cs/lib/messages';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';

export const messageDirection = pgEnum('MessageDirection', [
  MessageDirection.Outbound,
  MessageDirection.Inbound,
]);
export const messageContentType = pgEnum('MessageContentType', [
  MessageContentType.TextHtml,
  MessageContentType.TextJson,
  MessageContentType.TextPlain,
]);
export const messageStatus = pgEnum('MessageStatus', [
  MessageStatus.Seen,
  MessageStatus.DeliveredToDevice,
  MessageStatus.DeliveredToCloud,
  MessageStatus.Sent,
  MessageStatus.Pending,
]);

export const messages = pgTable('Message', {
  id: serial('id').primaryKey().notNull(),
  status: messageStatus('status').notNull(),
  contentType: messageContentType('contentType').notNull(),
  content: text('content').notNull(),
  direction: messageDirection('direction').notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  createdById: integer('createdById')
    .notNull()
    .references(() => contacts.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  ticketId: integer('ticketId')
    .notNull()
    .references(() => tickets.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  createdBy: one(contacts, {
    fields: [messages.createdById],
    references: [contacts.id],
  }),
  ticket: one(tickets, {
    fields: [messages.ticketId],
    references: [tickets.id],
  }),
}));
