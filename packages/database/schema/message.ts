import { integer, jsonb, pgEnum, serial, timestamp } from 'drizzle-orm/pg-core';

import { pgTable } from './_table';
import { contact } from './contact';
import { ticket } from './ticket';

export const messageDirection = pgEnum('MessageDirection', [
  'Outbound',
  'Inbound',
]);
export const messageContentType = pgEnum('MessageContentType', [
  'TextHtml',
  'TextPlain',
]);
export const messageStatus = pgEnum('MessageStatus', [
  'Seen',
  'DeliveredToDevice',
  'DeliveredToCloud',
  'Sent',
  'Pending',
]);

export const message = pgTable('Message', {
  id: serial('id').primaryKey().notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  status: messageStatus('status').notNull(),
  contentType: messageContentType('contentType').notNull(),
  content: jsonb('content').notNull(),
  direction: messageDirection('direction').notNull(),
  senderId: integer('senderId')
    .notNull()
    .references(() => contact.id, {
      onDelete: 'restrict',
      onUpdate: 'cascade',
    }),
  ticketId: integer('ticketId')
    .notNull()
    .references(() => ticket.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
});
