import { FC, useCallback, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FormattedMessage, useIntl } from 'react-intl';

import { RouterOutputs } from '@cs/api';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '~/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { api } from '~/lib/api';
import { getInitials } from '~/lib/string';
import { cn } from '~/lib/utils';

type TicketAssignmentComboboxProps = {
  assignedTo?: NonNullable<RouterOutputs['ticket']['byId']>['assignedTo'];
  ticketId: number;
};

export const TicketAssignmentCombobox: FC<TicketAssignmentComboboxProps> = ({
  assignedTo,
  ticketId,
}) => {
  const { formatMessage } = useIntl();
  const { data: sessionData } = useSession();

  const [open, setOpen] = useState(false);

  const utils = api.useContext();

  const { data: contactsData } = api.contact.allWithUserId.useQuery(undefined, {
    select: useCallback(
      (data: RouterOutputs['contact']['allWithUserId']) => {
        let newContacts = data.map((contact) => contact);
        if (sessionData?.user.contactId) {
          const sessionContact = newContacts.find(
            (contact) => contact.id === sessionData.user.contactId
          );
          if (sessionContact) {
            newContacts = [
              sessionContact,
              ...newContacts.filter(
                (contact) => contact.id !== sessionContact.id
              ),
            ];
          }
        }
        if (assignedTo) {
          const assignedToContact = newContacts.find(
            (contact) => contact.id === assignedTo.id
          );
          if (assignedToContact) {
            newContacts = [
              assignedToContact,
              ...newContacts.filter(
                (contact) => contact.id !== assignedToContact.id
              ),
            ];
          }
        }

        return newContacts;
      },
      [assignedTo, sessionData?.user]
    ),
  });

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
          <CommandGroup>
            {contactsData?.map((contact) => (
              <CommandItem
                key={contact.id}
                value={contact.id.toString()}
                onSelect={(value) => {
                  const parsedValue = parseInt(value, 10);
                  if (assignedTo) {
                    if (parsedValue === assignedTo.id) {
                      removeAssignment({ id: ticketId });
                    } else {
                      changeAssignment({
                        id: ticketId,
                        contactId: parsedValue,
                      });
                    }
                  } else {
                    addAssignment({
                      id: ticketId,
                      contactId: parsedValue,
                    });
                  }
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4 shrink-0',
                    assignedTo?.id === contact.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                <div className="flex items-center gap-x-2 truncate">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={contact?.avatarUrl ?? undefined} />
                    <AvatarFallback>
                      {getInitials(contact?.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="truncate text-xs text-muted-foreground">
                    {contact?.name}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
