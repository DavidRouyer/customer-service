import { graphql } from '@/gql/gql';
import { useMutation } from '@/hooks/use-query';

export const AddMessageMutation = graphql(/* GraphQL */ `
  mutation AddMessage($ticketId: ID!, $message: AddMessageInput!) {
    addMessage(ticketId: $ticketId, message: $message)
  }
`);

export const useAddMessage = () => {
  const { trigger } = useMutation(AddMessageMutation);

  return { trigger };
};
