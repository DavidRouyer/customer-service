import { FC } from 'react';
import { XCircle } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { RouterOutputs } from '@cs/api';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { api } from '~/utils/api';
import { getInitials } from '~/utils/string';

type TicketChangeAssignmentProps = {
  assignedTo?: NonNullable<RouterOutputs['ticket']['byId']>['assignedTo'];
  ticketId: number;
};

export const TicketChangeAssignment: FC<TicketChangeAssignmentProps> = ({
  assignedTo,
  ticketId,
}) => {
  const utils = api.useContext();

  const { data: contactsData } = api.contact.allWithUserId.useQuery();

  const { mutateAsync: assignTicket } = api.ticket.assign.useMutation({
    onMutate: async (newAssignment) => {
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
            assignedToId: newAssignment.contactId,
            assignedTo: contactsData?.find(
              (contact) => contact.id === newAssignment.contactId
            ),
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

  const { mutateAsync: removeAssignmentTicket } =
    api.ticket.removeAssignment.useMutation({
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
              assignedToId: null,
              assignedTo: null,
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className="flex items-center justify-between gap-x-1 text-sm leading-6"
        >
          {assignedTo ? (
            <div className="flex items-center gap-x-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={assignedTo?.avatarUrl ?? undefined} />
                <AvatarFallback>
                  {getInitials(assignedTo?.name ?? '')}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">
                {assignedTo?.name}
              </p>
            </div>
          ) : (
            <FormattedMessage id="ticket.actions.assign_to" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {assignedTo && (
            <DropdownMenuItem
              onClick={() =>
                removeAssignmentTicket({
                  id: ticketId,
                })
              }
              className="flex items-center gap-x-2 text-destructive"
            >
              <XCircle className="h-5 w-5" />
              <FormattedMessage id="ticket.actions.remove_assignment" />
            </DropdownMenuItem>
          )}
          {contactsData
            ?.filter((contact) => contact.id !== assignedTo?.id)
            ?.map((contact) => (
              <DropdownMenuItem
                key={contact.id}
                onClick={() =>
                  assignTicket({
                    id: ticketId,
                    contactId: contact.id,
                  })
                }
              >
                <div className="flex items-center gap-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={contact?.avatarUrl ?? undefined} />
                    <AvatarFallback>
                      {getInitials(contact?.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-muted-foreground">
                    {contact?.name}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
