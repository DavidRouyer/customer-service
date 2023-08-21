import { Contact } from '~/gql/graphql';

export type TicketId = string;

export class Ticket {
  readonly id: TicketId;
  content?: string | null;
  contact: Contact;
  createdAt: Date;

  constructor(
    id: TicketId,
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
