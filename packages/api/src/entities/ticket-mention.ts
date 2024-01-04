import { InferInsertModel, schema } from '@cs/database';

export type TicketMentionInsert = InferInsertModel<
  typeof schema.ticketMentions
>;
