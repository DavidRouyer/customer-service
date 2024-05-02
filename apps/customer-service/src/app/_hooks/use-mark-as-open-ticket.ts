import { useQueryClient } from '@tanstack/react-query';

import { RouterOutputs } from '@cs/api';
import { TicketStatus } from '@cs/kyaku/models';

import { useInfiniteTicketTimelineQuery } from '~/graphql/generated/client';
import { api } from '~/trpc/react';

export const useMarkAsOpenTicket = () => {
  const utils = api.useUtils();
  const queryClient = useQueryClient();

  const { mutateAsync } = api.ticket.markAsOpen.useMutation({
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticket.byId.cancel({ id });

      // Snapshot the previous value
      const previousTicket = utils.ticket.byId.getData({ id });

      // Optimistically update to the new value
      utils.ticket.byId.setData(
        { id },
        (oldQueryData) =>
          ({
            ...oldQueryData,
            status: TicketStatus.Open,
          }) as NonNullable<RouterOutputs['ticket']['byId']>
      );

      // Return a context object with the snapshotted value
      return { previousTicket: previousTicket };
    },
    onError: (err, { id }, context) => {
      // TODO: handle failed queries
      utils.ticket.byId.setData({ id }, context?.previousTicket);
    },
    onSettled: (_, __, { id }) => {
      void utils.ticket.byId.invalidate({ id });
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({ ticketId: id }),
      });
    },
  });

  return {
    markAsOpenTicket: mutateAsync,
  };
};
