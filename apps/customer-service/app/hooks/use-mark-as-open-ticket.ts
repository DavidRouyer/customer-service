import { useQueryClient } from '@tanstack/react-query';
import type { TicketQuery } from 'graphql/generated/client';
import {
  useInfiniteTicketTimelineQuery,
  useMarkTicketAsOpenMutation,
  useTicketQuery,
} from 'graphql/generated/client';

import { TicketStatus } from '@cs/kyaku/models';

export const useMarkAsOpenTicket = () => {
  const queryClient = useQueryClient();

  const mutationResult = useMarkTicketAsOpenMutation({
    onMutate: async ({ input }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: useTicketQuery.getKey({ ticketId: input.ticketId }),
      });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ ticketId: input.ticketId })
      );

      // Optimistically update to the new value
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ ticketId: input.ticketId }),
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
    onError: (err, { input }, context) => {
      // TODO: handle failed queries
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ ticketId: input.ticketId }),
        context?.previousTicket
      );
    },
    onSettled: (_, __, { input }) => {
      void queryClient.invalidateQueries({
        queryKey: useTicketQuery.getKey({ ticketId: input.ticketId }),
      });
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({
          ticketId: input.ticketId,
        }),
      });
    },
  });

  return mutationResult;
};
