import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@cs/database/schema/message';

import { Contact } from '~/hooks/useTicket/Contact';

export enum FailedMessageStatus {
  Failed = 'Failed',
}

export type ExtendedMessageStatus = MessageStatus | FailedMessageStatus;

export type Message = {
  id: number;
  createdAt: Date;
  content: string;
  contentType: MessageContentType;
  direction: MessageDirection;
  status: ExtendedMessageStatus;
  sender: Contact;
};
