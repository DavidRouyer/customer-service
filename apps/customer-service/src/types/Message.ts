import { RouterOutputs } from '@cs/api';

export enum FailedMessageStatus {
  Failed = 'Failed',
}

export type ExtendedMessageStatus =
  | RouterOutputs['ticketChat']['byTicketId'][0]['status']
  | FailedMessageStatus;

export type Message = RouterOutputs['ticketChat']['byTicketId'][0] & {
  status: ExtendedMessageStatus;
};
