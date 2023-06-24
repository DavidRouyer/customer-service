import {
  Contact,
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@/gql/graphql';

export type Message = {
  id: string;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  contentType: MessageContentType;
  direction: MessageDirection;
  status: MessageStatus;
  sender: Contact;
};
