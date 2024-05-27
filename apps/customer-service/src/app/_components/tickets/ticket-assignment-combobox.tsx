import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Plus } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';

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

import type { TicketQuery, UsersQuery } from '~/graphql/generated/client';
import {
  useAssignTicketMutation,
  useInfiniteTicketTimelineQuery,
  useMyUserInfoQuery,
  useTicketQuery,
  useUnassignTicketMutation,
  useUsersQuery,
} from '~/graphql/generated/client';

interface TicketAssignmentComboboxProps {
  assignedTo?: NonNullable<TicketQuery['ticket']>['assignedTo'];
  ticketId: string;
}

export const TicketAssignmentCombobox: FC<TicketAssignmentComboboxProps> = ({
  assignedTo,
  ticketId,
}) => {
  const { formatMessage } = useIntl();
  const { data: myUserInfo } = useMyUserInfoQuery(undefined, {
    select: (data) => ({ user: data.myUserInfo }),
  });

  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: usersData } = useUsersQuery(
    {
      first: 100,
    },
    {
      select: useCallback(
        (data: UsersQuery) => {
          let newUsers = data.users.edges.map((user) => user.node);
          if (myUserInfo?.user?.id) {
            const loggedUser = newUsers.find(
              (user) => user.id === myUserInfo.user?.id
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
        [assignedTo, myUserInfo?.user]
      ),
    }
  );

  const { mutate: assign } = useAssignTicketMutation({
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
                assignedTo: usersData?.find((user) => user.id === input.userId),
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
        queryKey: useInfiniteTicketTimelineQuery.getKey({ ticketId: ticketId }),
      });
    },
  });

  const { mutate: unassign } = useUnassignTicketMutation({
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
                assignedTo: null,
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
        queryKey: useInfiniteTicketTimelineQuery.getKey({ ticketId: ticketId }),
      });
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
                <AvatarImage src={assignedTo.image ?? undefined} />
                <AvatarFallback>
                  {getInitials(assignedTo.name ?? '')}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">{assignedTo.name}</p>
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
          <CommandList>
            <CommandEmpty>
              <FormattedMessage id="ticket.assignment.no_results" />
            </CommandEmpty>
            <CommandGroup>
              {(usersData ?? []).map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    if (assignedTo && user.id === assignedTo.id) {
                      unassign({ input: { id: ticketId } });
                    } else {
                      assign({ input: { id: ticketId, userId: user.id } });
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
                      <AvatarImage src={user.image ?? undefined} />
                      <AvatarFallback>
                        {getInitials(user.name ?? '')}
                      </AvatarFallback>
                    </Avatar>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.name}
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
