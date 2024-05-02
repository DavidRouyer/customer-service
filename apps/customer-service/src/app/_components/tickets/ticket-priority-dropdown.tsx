import { FC } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Shield, ShieldAlert } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { RouterOutputs } from '@cs/api';
import { TicketPriority as TicketPriorityType } from '@cs/kyaku/models';
import { Button } from '@cs/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@cs/ui/dropdown-menu';
import { TicketPriorityBadge } from '@cs/ui/ticket-priority-badge';

import {
  TicketQuery,
  useInfiniteTicketTimelineQuery,
  useTicketQuery,
} from '~/graphql/generated/client';
import { api } from '~/trpc/react';

type TicketChangePriorityProps = {
  priority: NonNullable<RouterOutputs['ticket']['byId']>['priority'];
  ticketId: string;
};

export const TicketPriorityDropdowm: FC<TicketChangePriorityProps> = ({
  priority,
  ticketId,
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync } = api.ticket.changePriority.useMutation({
    onMutate: async (newPriority) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: useTicketQuery.getKey({ id: newPriority.id }),
      });

      // Snapshot the previous value
      const previousTicket = queryClient.getQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ id: newPriority.id })
      );

      // Optimistically update to the new value
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ id: newPriority.id }),
        (oldQueryData) =>
          oldQueryData
            ? {
                ...oldQueryData,
                priority: newPriority.priority,
              }
            : undefined
      );

      // Return a context object with the snapshotted value
      return { previousTicket };
    },
    onError: (err, { id }, context) => {
      // TODO: handle failed queries
      queryClient.setQueryData<TicketQuery['ticket']>(
        useTicketQuery.getKey({ id: ticketId }),
        context?.previousTicket
      );
    },
    onSettled: (_, __, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: useTicketQuery.getKey({ id }),
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
                id: ticketId,
                priority: TicketPriorityType.Critical,
              })
            }
            disabled={priority === TicketPriorityType.Critical}
          >
            <div className="flex items-center gap-x-2">
              <ShieldAlert className="size-5 text-destructive" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.priorities.critical" />
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="high"
            onClick={() =>
              mutateAsync({ id: ticketId, priority: TicketPriorityType.High })
            }
            disabled={priority === TicketPriorityType.High}
          >
            <div className="flex items-center gap-x-2">
              <Shield className="size-5 text-destructive" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.priorities.high" />
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="medium"
            onClick={() =>
              mutateAsync({ id: ticketId, priority: TicketPriorityType.Medium })
            }
            disabled={priority === TicketPriorityType.Medium}
          >
            <div className="flex items-center gap-x-2">
              <Shield className="size-5 text-warning" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.priorities.medium" />
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="low"
            onClick={() =>
              mutateAsync({ id: ticketId, priority: TicketPriorityType.Low })
            }
            disabled={priority === TicketPriorityType.Low}
          >
            <div className="flex items-center gap-x-2">
              <Shield className="size-5 text-muted-foreground" />
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
