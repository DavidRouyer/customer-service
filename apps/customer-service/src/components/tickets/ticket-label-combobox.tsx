import { FC, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';

import { RouterOutputs } from '@cs/api';

import { Badge } from '~/components/ui/badge';
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
import { cn } from '~/lib/utils';

type TicketLabelComboboxProps = {
  labels?: NonNullable<RouterOutputs['ticket']['byId']>['labels'];
  ticketId: string;
};

export const TicketLabelCombobox: FC<TicketLabelComboboxProps> = ({
  labels,
  ticketId,
}) => {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);

  const utils = api.useUtils();

  const { data: labelTypesData } = api.labelType.all.useQuery({
    isArchived: false,
  });

  const ticketLabelsTypes = labels
    ?.map(
      (label) =>
        labelTypesData?.find((labelType) => labelType.id === label.labelTypeId)
    )
    .filter((labelType) => labelType !== undefined);

  const { mutateAsync: addLabels } = api.label.addLabels.useMutation({
    onMutate: async (newLabels) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticket.byId.cancel({ id: newLabels.ticketId });

      // Snapshot the previous value
      const previousTicket = utils.ticket.byId.getData({
        id: newLabels.ticketId,
      });

      // Optimistically update to the new value
      utils.ticket.byId.setData(
        { id: newLabels.ticketId },
        (oldQueryData) =>
          ({
            ...oldQueryData,
            labels: previousTicket?.labels?.concat(
              newLabels.labelTypeIds.map((labelTypeId) => ({
                id: `${newLabels.ticketId}-${labelTypeId}`,
                labelTypeId,
                ticketId: newLabels.ticketId,
              }))
            ),
          }) as NonNullable<RouterOutputs['ticket']['byId']>
      );

      // Return a context object with the snapshotted value
      return { previousTicket: previousTicket };
    },
    onError: (err, { ticketId }, context) => {
      // TODO: handle failed queries
      utils.ticket.byId.setData({ id: ticketId }, context?.previousTicket);
    },
    onSettled: (_, __, { ticketId }) => {
      void utils.ticket.byId.invalidate({ id: ticketId });
      void utils.ticketActivity.byTicketId.invalidate({ ticketId });
    },
  });

  const { mutateAsync: removeLabels } = api.label.removeLabels.useMutation({
    onMutate: async (removeLabels) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticket.byId.cancel({ id: removeLabels.ticketId });

      // Snapshot the previous value
      const previousTicket = utils.ticket.byId.getData({
        id: removeLabels.ticketId,
      });

      // Optimistically update to the new value
      utils.ticket.byId.setData(
        { id: removeLabels.ticketId },
        (oldQueryData) =>
          ({
            ...oldQueryData,
            labels: previousTicket?.labels?.filter(
              (label) => !removeLabels.labelTypeIds.includes(label.labelTypeId)
            ),
          }) as NonNullable<RouterOutputs['ticket']['byId']>
      );

      // Return a context object with the snapshotted value
      return { previousTicket: previousTicket };
    },
    onError: (err, { ticketId }, context) => {
      // TODO: handle failed queries
      utils.ticket.byId.setData({ id: ticketId }, context?.previousTicket);
    },
    onSettled: (_, __, { ticketId }) => {
      void utils.ticket.byId.invalidate({ id: ticketId });
      void utils.ticketActivity.byTicketId.invalidate({ ticketId });
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
          {(ticketLabelsTypes?.length ?? 0) > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {ticketLabelsTypes?.map((labelType) => (
                <Badge key={labelType?.id}> {labelType?.name}</Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-x-2 text-xs">
              <Plus className="h-4 w-4" />
              <span>
                <FormattedMessage id="ticket.actions.add_label" />
              </span>
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={formatMessage({
              id: 'ticket.labeling.search.placeholder',
            })}
          />
          <CommandEmpty>
            <FormattedMessage id="ticket.labeling.no_results" />
          </CommandEmpty>
          <CommandGroup>
            {labelTypesData?.map((labelType) => (
              <CommandItem
                key={labelType.id}
                onSelect={() => {
                  if (
                    labels
                      ?.map((label) => label.labelTypeId)
                      .includes(labelType.id)
                  ) {
                    removeLabels({ ticketId, labelTypeIds: [labelType.id] });
                  } else {
                    addLabels({ ticketId, labelTypeIds: [labelType.id] });
                  }
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4 shrink-0',
                    labels
                      ?.map((label) => label.labelTypeId)
                      .includes(labelType.id)
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                <div className="flex items-center gap-x-2 truncate">
                  <p className="truncate text-xs text-muted-foreground">
                    {labelType?.name}
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
