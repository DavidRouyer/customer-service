import { FC } from 'react';
import { Plus, XCircle } from 'lucide-react';
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

type TicketAssignmentDropdownProps = {
  assignedTo?: NonNullable<RouterOutputs['ticket']['byId']>['assignedTo'];
  ticketId: number;
};

export const TicketAssignmentDropdown: FC<TicketAssignmentDropdownProps> = ({
  assignedTo,
  ticketId,
}) => {
  const utils = api.useContext();

  const { data: contactsData } = api.contact.allWithUserId.useQuery();

  const { mutateAsync: addAssignment } = api.ticket.addAssignment.useMutation({
    onMutate: async (newAssignment) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticket.byId.cancel({ id: newAssignment.id });

      // Snapshot the previous value
      const previousTicket = utils.ticket.byId.getData({
        id: newAssignment.id,
      });

      // Optimistically update to the new value
      utils.ticket.byId.setData(
        { id: newAssignment.id },
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
    onError: (err, { id }, context) => {
      // TODO: handle failed queries
      utils.ticket.byId.setData({ id }, context?.previousTicket);
    },
    onSettled: (_, __, { id }) => {
      void utils.ticket.byId.invalidate({ id });
      void utils.ticketActivity.byTicketId.invalidate({ ticketId: id });
    },
  });

  const { mutateAsync: changeAssignment } =
    api.ticket.changeAssignment.useMutation({
      onMutate: async (newAssignment) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await utils.ticket.byId.cancel({ id: newAssignment.id });

        // Snapshot the previous value
        const previousTicket = utils.ticket.byId.getData({
          id: newAssignment.id,
        });

        // Optimistically update to the new value
        utils.ticket.byId.setData(
          { id: newAssignment.id },
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
      onError: (err, { id }, context) => {
        // TODO: handle failed queries
        utils.ticket.byId.setData({ id }, context?.previousTicket);
      },
      onSettled: (_, __, { id }) => {
        void utils.ticket.byId.invalidate({ id });
        void utils.ticketActivity.byTicketId.invalidate({ ticketId: id });
      },
    });

  const { mutateAsync: removeAssignment } =
    api.ticket.removeAssignment.useMutation({
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
              assignedToId: null,
              assignedTo: null,
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
        void utils.ticketActivity.byTicketId.invalidate({ ticketId: id });
      },
    });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex h-auto items-center justify-between gap-x-1 px-2 text-sm leading-6"
        >
          {assignedTo ? (
            <div className="flex items-center gap-x-2">
              <Avatar className="h-4 w-4">
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
            <div className="flex items-center gap-x-2 text-xs">
              <Plus className="h-4 w-4" />
              <span>
                <FormattedMessage id="ticket.actions.assign_to" />
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          {assignedTo ? (
            <DropdownMenuItem
              onClick={() =>
                removeAssignment({
                  id: ticketId,
                })
              }
              className="flex items-center gap-x-2 text-destructive"
            >
              <XCircle className="h-5 w-5" />
              <FormattedMessage id="ticket.actions.remove_assignment" />
            </DropdownMenuItem>
          ) : null}
          {contactsData
            ?.filter((contact) => contact.id !== assignedTo?.id)
            ?.map((contact) => (
              <DropdownMenuItem
                key={contact.id}
                onClick={() => {
                  if (assignedTo) {
                    changeAssignment({
                      id: ticketId,
                      contactId: contact.id,
                    });
                  } else {
                    addAssignment({
                      id: ticketId,
                      contactId: contact.id,
                    });
                  }
                }}
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
