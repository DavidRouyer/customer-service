import { FC, useCallback, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';

import { RouterOutputs } from '@cs/api';
import { getInitials } from '@cs/kyaku/utils';
import { cn } from '@cs/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@cs/ui/avatar';
import { Button } from '@cs/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@cs/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@cs/ui/popover';

import { api } from '~/trpc/react';

type TicketAssignmentComboboxProps = {
  assignedTo?: NonNullable<RouterOutputs['ticket']['byId']>['assignedTo'];
  ticketId: string;
};

export const TicketAssignmentCombobox: FC<TicketAssignmentComboboxProps> = ({
  assignedTo,
  ticketId,
}) => {
  const { formatMessage } = useIntl();
  const { data: session } = api.auth.getSession.useQuery();

  const [open, setOpen] = useState(false);

  const utils = api.useUtils();

  const { data: usersData } = api.user.all.useQuery(undefined, {
    select: useCallback(
      (data: RouterOutputs['user']['all']) => {
        let newUsers = data.map((user) => user);
        if (session?.user.id) {
          const loggedUser = newUsers.find(
            (user) => user.id === session.user.id
          );
          if (loggedUser) {
            newUsers = [
              loggedUser,
              ...newUsers.filter((user) => user.id !== loggedUser.id),
            ];
          }
        }
        if (assignedTo) {
          const assignedToUser = newUsers.find(
            (user) => user.id === assignedTo.id
          );
          if (assignedToUser) {
            newUsers = [
              assignedToUser,
              ...newUsers.filter((user) => user.id !== assignedToUser.id),
            ];
          }
        }

        return newUsers;
      },
      [assignedTo, session?.user]
    ),
  });

  const { mutateAsync: assign } = api.ticket.assign.useMutation({
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
            assignedToId: newAssignment.userId,
            assignedTo: usersData?.find(
              (user) => user.id === newAssignment.userId
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
      void utils.ticketTimeline.byTicketId.invalidate({ ticketId: id });
    },
  });

  const { mutateAsync: unassign } = api.ticket.unassign.useMutation({
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
      void utils.ticketTimeline.byTicketId.invalidate({ ticketId: id });
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="flex h-auto items-center justify-between gap-x-1 px-2 text-sm leading-6"
        >
          {assignedTo ? (
            <div className="flex items-center gap-x-2">
              <Avatar className="size-4">
                <AvatarImage src={assignedTo?.image ?? undefined} />
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
              <Plus className="size-4" />
              <span>
                <FormattedMessage id="ticket.actions.assign_to" />
              </span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={formatMessage({
              id: 'ticket.assignment.search.placeholder',
            })}
          />
          <CommandEmpty>
            <FormattedMessage id="ticket.assignment.no_results" />
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {(usersData ?? []).map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    if (assignedTo && user.id === assignedTo.id) {
                      unassign({ id: ticketId });
                    } else {
                      assign({
                        id: ticketId,
                        userId: user.id,
                      });
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      assignedTo?.id === user.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex items-center gap-x-2 truncate">
                    <Avatar className="size-5">
                      <AvatarImage src={user?.image ?? undefined} />
                      <AvatarFallback>
                        {getInitials(user?.name ?? '')}
                      </AvatarFallback>
                    </Avatar>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.name}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
