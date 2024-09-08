import type { FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FormattedMessage } from 'react-intl';

import type { TicketPriority } from '@cs/kyaku/models';
import { TicketPriority as TicketPriorityType } from '@cs/kyaku/models';
import { Button } from '@cs/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@cs/ui/dropdown-menu';
import {
  PriorityCritical,
  PriorityHigh,
  PriorityLow,
  PriorityMedium,
} from '@cs/ui/icons';
import { TicketPriorityBadge } from '@cs/ui/ticket-priority-badge';

import type { TicketQuery } from '~/graphql/generated/client';
import {
  useChangeTicketPriorityMutation,
  useInfiniteTicketTimelineQuery,
  useTicketQuery,
} from '~/graphql/generated/client';

interface TicketChangePriorityProps {
  priority: TicketPriority;
  ticketId: string;
}

export const TicketPriorityDropdowm: FC<TicketChangePriorityProps> = ({
  priority,
  ticketId,
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync } = useChangeTicketPriorityMutation({
    onMutate: async ({ input }) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: useTicketQuery.getKey({ ticketId: input.ticketId }),
      });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ ticketId: input.ticketId })
      );

      // Optimistically update to the new value
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ ticketId: input.ticketId }),
        (oldQueryData) =>
          oldQueryData
            ? {
                ...oldQueryData,
                priority: input.priority,
              }
            : undefined
      );

      // Return a context object with the snapshotted value
      return { previousTicket };
    },
    onError: (err, { input }, context) => {
      // TODO: handle failed queries
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ ticketId: input.ticketId }),
        context?.previousTicket
      );
    },
    onSettled: (_, __, { input }) => {
      void queryClient.invalidateQueries({
        queryKey: useTicketQuery.getKey({ ticketId: input.ticketId }),
      });
      void queryClient.invalidateQueries({
        queryKey: useInfiniteTicketTimelineQuery.getKey({ ticketId: ticketId }),
      });
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
          <div className="flex items-center gap-x-2">
            <TicketPriorityBadge priority={priority} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            key="critical"
            onClick={() =>
              mutateAsync({
                input: {
                  ticketId: ticketId,
                  priority: TicketPriorityType.Critical,
                },
              })
            }
            disabled={priority === TicketPriorityType.Critical}
          >
            <div className="flex items-center gap-x-2">
              <PriorityCritical className="size-4" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.priorities.critical" />
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="high"
            onClick={() =>
              mutateAsync({
                input: {
                  ticketId: ticketId,
                  priority: TicketPriorityType.High,
                },
              })
            }
            disabled={priority === TicketPriorityType.High}
          >
            <div className="flex items-center gap-x-2">
              <PriorityHigh className="size-4" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.priorities.high" />
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="medium"
            onClick={() =>
              mutateAsync({
                input: {
                  ticketId: ticketId,
                  priority: TicketPriorityType.Medium,
                },
              })
            }
            disabled={priority === TicketPriorityType.Medium}
          >
            <div className="flex items-center gap-x-2">
              <PriorityMedium className="size-4" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.priorities.medium" />
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="low"
            onClick={() =>
              mutateAsync({
                input: { ticketId: ticketId, priority: TicketPriorityType.Low },
              })
            }
            disabled={priority === TicketPriorityType.Low}
          >
            <div className="flex items-center gap-x-2">
              <PriorityLow className="size-4" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.priorities.low" />
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
