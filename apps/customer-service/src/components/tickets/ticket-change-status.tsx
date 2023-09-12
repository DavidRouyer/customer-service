import { FC } from 'react';
import { BookOpenCheck, HardDriveUpload, Vote } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { RouterOutputs } from '@cs/api';
import { TicketStatus } from '@cs/database/schema/ticket';

import { Button } from '~/components/ui/button';
import { api } from '~/utils/api';

type TicketChangeStatusProps = {
  status?: NonNullable<RouterOutputs['ticket']['byId']>['status'];
  ticketId: number;
};

export const TicketChangeStatus: FC<TicketChangeStatusProps> = ({
  status,
  ticketId,
}) => {
  const utils = api.useContext();

  const { mutateAsync: resolveTicket } = api.ticket.resolve.useMutation({
    onMutate: async () => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticket.byId.cancel({ id: ticketId });

      // Snapshot the previous value
      const previousTicket = utils.ticket.byId.getData({ id: ticketId });

      // Optimistically update to the new value
      utils.ticket.byId.setData(
        { id: ticketId },
        (oldQueryData) =>
          ({
            ...oldQueryData,
            status: TicketStatus.Resolved,
          }) as NonNullable<RouterOutputs['ticket']['byId']>
      );

      // Return a context object with the snapshotted value
      return { previousTicket: previousTicket };
    },
    onError: (err, _newTicket, context) => {
      // TODO: handle failed queries
      utils.ticket.byId.setData({ id: ticketId }, context?.previousTicket);
    },
    onSettled: () => {
      void utils.ticket.byId.invalidate({ id: ticketId });
    },
  });
  const { mutateAsync: reopenTicket } = api.ticket.reopen.useMutation({
    onMutate: async () => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticket.byId.cancel({ id: ticketId });

      // Snapshot the previous value
      const previousTicket = utils.ticket.byId.getData({ id: ticketId });

      // Optimistically update to the new value
      utils.ticket.byId.setData(
        { id: ticketId },
        (oldQueryData) =>
          ({
            ...oldQueryData,
            status: TicketStatus.Open,
          }) as NonNullable<RouterOutputs['ticket']['byId']>
      );

      // Return a context object with the snapshotted value
      return { previousTicket: previousTicket };
    },
    onError: (err, _newTicket, context) => {
      // TODO: handle failed queries
      utils.ticket.byId.setData({ id: ticketId }, context?.previousTicket);
    },
    onSettled: () => {
      void utils.ticket.byId.invalidate({ id: ticketId });
    },
  });

  return status === TicketStatus.Resolved ? (
    <Button
      type="button"
      onClick={() => {
        reopenTicket({ id: ticketId });
      }}
      className="flex items-center gap-x-1"
    >
      <HardDriveUpload className="h-4 w-4" />
      <FormattedMessage id="ticket.actions.reopen" />
    </Button>
  ) : (
    <Button
      type="button"
      onClick={() => {
        resolveTicket({ id: ticketId });
      }}
      className="flex items-center gap-x-1"
    >
      <BookOpenCheck className="h-4 w-4" />
      <FormattedMessage id="ticket.actions.resolve" />
    </Button>
  );
};
