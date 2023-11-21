import { relations } from 'drizzle-orm';
import { pgEnum, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { generateEntityId } from '@cs/lib/generate-entity-id';
import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@cs/lib/messages';

import { pgTable } from './_table';
import { contacts } from './contact';
import { tickets } from './ticket';

export const messageDirection = pgEnum('messageDirection', [
  MessageDirection.Outbound,
  MessageDirection.Inbound,
]);
export const messageContentType = pgEnum('messageContentType', [
  MessageContentType.TextHtml,
  MessageContentType.TextJson,
  MessageContentType.TextPlain,
]);
export const messageStatus = pgEnum('messageStatus', [
  MessageStatus.Seen,
  MessageStatus.DeliveredToDevice,
  MessageStatus.DeliveredToCloud,
  MessageStatus.Sent,
  MessageStatus.Pending,
]);

export const messages = pgTable('message', {
  id: varchar('id').primaryKey().notNull().default(generateEntityId('', 'ms')),
  status: messageStatus('status').notNull(),
  contentType: messageContentType('contentType').notNull(),
  content: text('content').notNull(),
  direction: messageDirection('direction').notNull(),
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
