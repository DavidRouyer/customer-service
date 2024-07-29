import type { FC } from 'react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { TicketQuery } from 'graphql/generated/client';
import {
  useAddLabelsMutation,
  useInfiniteTicketTimelineQuery,
  useLabelTypesQuery,
  useRemoveLabelsMutation,
  useTicketQuery,
} from 'graphql/generated/client';
import { Check, Plus } from 'lucide-react';
import { FormattedMessage, useIntl } from 'react-intl';

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

interface TicketLabelComboboxProps {
  labels?: NonNullable<TicketQuery['ticket']>['labels'];
  ticketId: string;
}

export const TicketLabelCombobox: FC<TicketLabelComboboxProps> = ({
  labels,
  ticketId,
}) => {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);

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

  const { mutate: addLabels } = useAddLabelsMutation({
    onMutate: async ({ input }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: useTicketQuery.getKey({ ticketId: input.ticketId }),
      });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData<TicketQuery>(
        useTicketQuery.getKey({
          ticketId: input.ticketId,
        })
      );

      // Optimistically update to the new value
      queryClient.setQueryData<TicketQuery>(
        useTicketQuery.getKey({ ticketId: input.ticketId }),
        (oldQueryData) =>
          oldQueryData?.ticket
            ? {
                ...oldQueryData,
                ticket: {
                  ...oldQueryData.ticket,
                  labels: oldQueryData.ticket.labels.concat(
                    input.labelTypeIds.map((labelTypeId) => ({
                      id: `${input.ticketId}-${labelTypeId}`,
                      labelType: labelTypesData?.edges.find(
                        (labelType) => labelType.node.id === labelTypeId
                      )?.node ?? {
                        id: labelTypeId,
                        name: 'Unknown',
                        icon: null,
                      },
                      archivedAt: null,
                    }))
                  ),
                },
              }
            : undefined
      );

      // Return a context object with the snapshotted value
      return { previousTicket };
    },
    onError: (err, { input }, context) => {
      // TODO: handle failed queries
      queryClient.setQueryData<TicketQuery>(
        useTicketQuery.getKey({ ticketId: input.ticketId }),
        context?.previousTicket
      );
    },
    onSettled: (_, __, { input }) => {
      void queryClient.invalidateQueries({
        queryKey: useTicketQuery.getKey({ ticketId: input.ticketId }),
      });
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({
          ticketId: input.ticketId,
        }),
      });
    },
  });

  const { mutate: removeLabels } = useRemoveLabelsMutation({
    onMutate: async ({ input }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: useTicketQuery.getKey({ ticketId: input.ticketId }),
      });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData<TicketQuery>(
        useTicketQuery.getKey({
          ticketId: input.ticketId,
        })
      );

      // Optimistically update to the new value
      queryClient.setQueryData<TicketQuery>(
        useTicketQuery.getKey({ ticketId: input.ticketId }),
        (oldQueryData) =>
          oldQueryData?.ticket
            ? {
                ...oldQueryData,
                ticket: {
                  ...oldQueryData.ticket,
                  labels: oldQueryData.ticket.labels.filter(
                    (label) => !input.labelIds.includes(label.id)
                  ),
                },
              }
            : undefined
      );

      // Return a context object with the snapshotted value
      return { previousTicket };
    },
    onError: (err, { input }, context) => {
      // TODO: handle failed queries
      queryClient.setQueryData(
        useTicketQuery.getKey({ ticketId: input.ticketId }),
        context?.previousTicket
      );
    },
    onSettled: (_, __, { input }) => {
      void queryClient.invalidateQueries({
        queryKey: useTicketQuery.getKey({ ticketId: input.ticketId }),
      });
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({
          ticketId: input.ticketId,
        }),
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
                <Badge key={label.id}> {label.labelType.name}</Badge>
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
                        input: {
                          ticketId,
                          labelIds: [labelWithLabelType.id],
                        },
                      });
                    } else {
                      addLabels({
                        input: {
                          ticketId,
                          labelTypeIds: [labelType.node.id],
                        },
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
