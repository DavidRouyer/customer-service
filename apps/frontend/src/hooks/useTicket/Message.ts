import {
  Contact,
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@/gql/graphql';

export type Message = {
  id: string;
  createdAt: string;
  content: string;
  contentType: MessageContentType;
  direction: MessageDirection;
  status: MessageStatus;
  sender: Contact;
};
