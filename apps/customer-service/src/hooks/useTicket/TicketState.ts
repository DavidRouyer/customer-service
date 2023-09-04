import { Message } from '~/hooks/useTicket/Message';
import { Ticket } from '~/hooks/useTicket/Ticket';
import { User } from '~/hooks/useTicket/User';

export type TicketState = {
  currentUser?: User;
  tickets: Ticket[];
  activeTicket?: Ticket;
  messagesByTicketId: Map<number, Message[]>;
  currentMessages: Message[];
};
