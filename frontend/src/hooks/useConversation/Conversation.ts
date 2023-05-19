import { Contact } from '@/gql/graphql';

export type ConversationId = string;

export class Conversation {
  readonly id: ConversationId;
  content?: string | null;
  contact: Contact;
  createdAt: Date;

  constructor(
    id: ConversationId,
    contact: Contact,
    createdAt: Date,
    content?: string
  ) {
    this.id = id;
    this.content = content;
    this.contact = contact;
    this.createdAt = createdAt;
  }
}
