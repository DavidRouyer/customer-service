import { Contact } from '~/hooks/useTicket/Contact';

export type TicketId = number;

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
