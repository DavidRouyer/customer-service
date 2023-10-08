import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, serial, timestamp } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';

export enum MessageDirection {
  Outbound = 'Outbound',
  Inbound = 'Inbound',
}

export enum MessageContentType {
  TextHtml = 'TextHtml',
  TextPlain = 'TextPlain',
}

export enum MessageStatus {
  Seen = 'Seen',
  DeliveredToDevice = 'DeliveredToDevice',
  DeliveredToCloud = 'DeliveredToCloud',
  Sent = 'Sent',
  Pending = 'Pending',
}

export const messageDirection = pgEnum('MessageDirection', [
  MessageDirection.Outbound,
  MessageDirection.Inbound,
]);
export const messageContentType = pgEnum('MessageContentType', [
  MessageContentType.TextHtml,
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
  createdAt: timestamp('createdAt', { precision: 3, mode: 'date' })
    .defaultNow()
    .notNull(),
  status: messageStatus('status').notNull(),
  contentType: messageContentType('contentType').notNull(),
  content: jsonb('content').$type<string>().notNull(),
  direction: messageDirection('direction').notNull(),
  authorId: integer('authorId')
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
  author: one(contacts, {
    fields: [messages.authorId],
    references: [contacts.id],
  }),
  ticket: one(tickets, {
    fields: [messages.ticketId],
    references: [tickets.id],
  }),
}));
