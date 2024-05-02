import { useQueryClient } from '@tanstack/react-query';

import { RouterOutputs } from '@cs/api';
import { TicketStatus } from '@cs/kyaku/models';

import {
  TicketQuery,
  useInfiniteTicketTimelineQuery,
  useTicketQuery,
} from '~/graphql/generated/client';
import { api } from '~/trpc/react';

export const useMarkAsOpenTicket = () => {
  const queryClient = useQueryClient();

  const { mutateAsync } = api.ticket.markAsOpen.useMutation({
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: useTicketQuery.getKey({ id }),
      });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ id })
      );

      // Optimistically update to the new value
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ id }),
        (oldQueryData) =>
          oldQueryData
            ? {
                ...oldQueryData,
                status: TicketStatus.Open,
              }
            : undefined
      );

      // Return a context object with the snapshotted value
      return { previousTicket };
    },
    onError: (err, { id }, context) => {
      // TODO: handle failed queries
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ id }),
        context?.previousTicket
      );
    },
    onSettled: (_, __, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: useTicketQuery.getKey({ id }),
      });
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({ ticketId: id }),
      });
    },
  });

  return {
    markAsOpenTicket: mutateAsync,
  };
};
