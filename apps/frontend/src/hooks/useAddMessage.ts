import { useMutation } from '@tanstack/react-query';
import request from 'graphql-request';

import { graphql } from '@/gql/gql';
import { AddMessageInput } from '@/gql/graphql';

export const AddMessageMutation = graphql(/* GraphQL */ `
  mutation AddMessage($ticketId: ID!, $message: AddMessageInput!) {
    addMessage(ticketId: $ticketId, message: $message)
  }
`);

export const useAddMessage = () => {
  const { mutate } = useMutation({
    mutationFn: ({
      ticketId,
      message,
    }: {
      ticketId: string;
      message: AddMessageInput;
    }) =>
      request(
        `${import.meta.env.VITE_ENDPOINT_URL}/graphql`,
        AddMessageMutation,
        {
          ticketId,
          message,
        }
      ),
  });

  return { mutate };
};
