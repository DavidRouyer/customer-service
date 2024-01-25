import { InferInsertModel, InferSelectModel, schema } from '@cs/database';

export type TicketMention = InferSelectModel<typeof schema.ticketMentions>;
export type TicketMentionInsert = InferInsertModel<
  typeof schema.ticketMentions
>;
