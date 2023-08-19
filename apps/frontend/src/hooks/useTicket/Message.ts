import {
  Contact,
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '~/gql/graphql';

export enum FailedMessageStatus {
  Failed = 'Failed',
}

export type ExtendedMessageStatus = MessageStatus | FailedMessageStatus;

export type Message = {
  id: string;
  createdAt: string;
  content: string;
  contentType: MessageContentType;
  direction: MessageDirection;
  status: ExtendedMessageStatus;
  sender: Contact;
};
