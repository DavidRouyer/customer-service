import { RouterOutputs } from '@cs/api';

export enum FailedMessageStatus {
  Failed = 'Failed',
}

export type MessageContentType =
  RouterOutputs['message']['all'][0]['contentType'];
export type MessageDirection = RouterOutputs['message']['all'][0]['direction'];
export type MessageStatus = RouterOutputs['message']['all'][0]['status'];

export type ExtendedMessageStatus = MessageStatus | FailedMessageStatus;

export type Message = RouterOutputs['message']['all'][0] & {
  status: ExtendedMessageStatus;
};
