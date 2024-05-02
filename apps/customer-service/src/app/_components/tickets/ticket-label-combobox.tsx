import { FC, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Plus } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';

import { RouterOutputs } from '@cs/api';
import { cn } from '@cs/ui';
import { Badge } from '@cs/ui/badge';
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

import {
  useInfiniteTicketTimelineQuery,
  useLabelTypesQuery,
} from '~/graphql/generated/client';
import { api } from '~/trpc/react';

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
  const queryClient = useQueryClient();

  const { data: labelTypesData } = useLabelTypesQuery(
    {
      filters: {
        isArchived: false,
      },
    },
    {
      select: (data) => data.labelTypes,
    }
  );

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
      utils.ticket.byId.setData({ id: newLabels.ticketId }, (oldQueryData) => ({
        ...oldQueryData,
        labels: previousTicket?.labels?.concat(
          newLabels.labelTypeIds.map((labelTypeId) => ({
            id: `${newLabels.ticketId}-${labelTypeId}`,
            labelTypeId,
            labelType: labelTypesData?.edges?.find(
              (labelType) => labelType.node.id === labelTypeId
            )!,
            ticketId: newLabels.ticketId,
            archivedAt: null,
          }))
        ),
      }));

      // Return a context object with the snapshotted value
      return { previousTicket: previousTicket };
    },
    onError: (err, { ticketId }, context) => {
      // TODO: handle failed queries
      utils.ticket.byId.setData({ id: ticketId }, context?.previousTicket);
    },
    onSettled: (_, __, { ticketId }) => {
      void utils.ticket.byId.invalidate({ id: ticketId });
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({ ticketId: ticketId }),
      });
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
        (oldQueryData) => ({
          ...oldQueryData,
          labels: previousTicket?.labels?.filter(
            (label) => !removeLabels.labelIds.includes(label.id)
          ),
        })
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
          {(labels?.length ?? 0) > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {labels?.map((label) => (
                <Badge key={label?.id}> {label.labelType.name}</Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-x-2 text-xs">
              <Plus className="size-4" />
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
          <CommandList>
            <CommandEmpty>
              <FormattedMessage id="ticket.labeling.no_results" />
            </CommandEmpty>
            <CommandGroup>
              {(labelTypesData?.edges ?? []).map((labelType) => (
                <CommandItem
                  key={labelType.node.id}
                  onSelect={() => {
                    const labelWithLabelType = labels?.find(
                      (label) => label.labelType.id === labelType.node.id
                    );
                    if (labelWithLabelType) {
                      removeLabels({
                        ticketId,
                        labelIds: [labelWithLabelType.id],
                      });
                    } else {
                      addLabels({
                        ticketId,
                        labelTypeIds: [labelType.node.id],
                      });
                    }
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 shrink-0',
                      labels
                        ?.map((label) => label.labelType.id)
                        .includes(labelType.node.id)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  <div className="flex items-center gap-x-2 truncate">
                    <p className="truncate text-xs text-muted-foreground">
                      {labelType.node.name}
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
