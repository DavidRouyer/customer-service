import { useQueryClient } from '@tanstack/react-query';

import { TicketStatus } from '@cs/kyaku/models';

import type { TicketQuery } from '~/graphql/generated/client';
import {
  useInfiniteTicketTimelineQuery,
  useMarkTicketAsDoneMutation,
  useTicketQuery,
} from '~/graphql/generated/client';

export const useMarkAsDoneTicket = () => {
  const queryClient = useQueryClient();

  const mutationResult = useMarkTicketAsDoneMutation({
    onMutate: async ({ input }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: useTicketQuery.getKey({ id: input.id }),
      });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ id: input.id })
      );

      // Optimistically update to the new value
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ id: input.id }),
        (oldQueryData) =>
          oldQueryData
            ? {
                ...oldQueryData,
                status: TicketStatus.Done,
              }
            : undefined
      );

      // Return a context object with the snapshotted value
      return { previousTicket };
    },
    onError: (err, { input }, context) => {
      // TODO: handle failed queries
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ id: input.id }),
        context?.previousTicket
      );
    },
    onSettled: (_, __, { input }) => {
      void queryClient.invalidateQueries({
        queryKey: useTicketQuery.getKey({ id: input.id }),
      });
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({ ticketId: input.id }),
      });
    },
  });

  return mutationResult;
};
