import { graphql } from '@/gql/gql';
import {
  MessageContentType,
  MessageDirection,
  MessageStatus,
} from '@/gql/graphql';
import { useMutation } from '@/hooks/use-query';

export const AddMessageMutation = graphql(/* GraphQL */ `
  mutation AddMessage($ticketId: ID!, $message: AddMessageInput!) {
    addMessage(ticketId: $ticketId, message: $message)
  }
`);

export const useAddMessage = () => {
  const { trigger } = useMutation(AddMessageMutation, {
    ticketId: '1',
    message: {
      senderId: 1,
      direction: MessageDirection.Outbound,
      contentType: MessageContentType.TextPlain,
      status: MessageStatus.Pending,
      content: 'Hello',
      createdAt: new Date().toISOString(),
    },
  });

  return { trigger };
};
