import { RouterOutputs } from '@cs/api';

export type Contact = RouterOutputs['message']['byTicketId'][0]['createdBy'];
