import { RouterOutputs } from '@cs/api';

export type Contact = RouterOutputs['ticketChat']['byTicketId'][0]['createdBy'];
