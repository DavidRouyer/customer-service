import { RouterOutputs } from '@cs/api';
import { TicketStatus } from '@cs/kyaku/models';

import { api } from '~/trpc/react';

export const useMarkAsDoneTicket = () => {
  const utils = api.useUtils();

  const { mutateAsync } = api.ticket.markAsDone.useMutation({
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
            status: TicketStatus.Done,
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
      void utils.ticketTimeline.byTicketId.invalidate({ ticketId: id });
    },
  });

  return {
    markAsDoneTicket: mutateAsync,
  };
};
