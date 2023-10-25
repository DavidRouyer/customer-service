import { RouterOutputs } from '@cs/api';

export enum FailedMessageStatus {
  Failed = 'Failed',
}

export type MessageContentType =
  RouterOutputs['message']['byTicketId'][0]['contentType'];
export type MessageStatus = RouterOutputs['message']['byTicketId'][0]['status'];

export type ExtendedMessageStatus = MessageStatus | FailedMessageStatus;

export type Message = RouterOutputs['message']['byTicketId'][0] & {
  status: ExtendedMessageStatus;
};
