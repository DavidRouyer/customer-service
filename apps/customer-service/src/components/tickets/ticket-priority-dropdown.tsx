import { FC } from 'react';
import { Shield, ShieldAlert } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { RouterOutputs } from '@cs/api';
import { TicketPriority as TicketPriorityType } from '@cs/lib/tickets';

import { TicketPriority } from '~/components/tickets/ticket-priority';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { api } from '~/lib/api';

type TicketChangePriorityProps = {
  priority: NonNullable<RouterOutputs['ticket']['byId']>['priority'];
  ticketId: string;
};

export const TicketPriorityDropdowm: FC<TicketChangePriorityProps> = ({
  priority,
  ticketId,
}) => {
  const utils = api.useUtils();

  const { mutateAsync } = api.ticket.changePriority.useMutation({
    onMutate: async (newPriority) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.ticket.byId.cancel({ id: newPriority.id });

      // Snapshot the previous value
      const previousTicket = utils.ticket.byId.getData({ id: newPriority.id });

      // Optimistically update to the new value
      utils.ticket.byId.setData(
        { id: newPriority.id },
        (oldQueryData) =>
          ({
            ...oldQueryData,
            priority: newPriority.priority,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex h-auto items-center justify-between gap-x-1 px-2 text-sm leading-6"
        >
          <div className="flex items-center gap-x-2">
            <TicketPriority priority={priority} />
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
              <ShieldAlert className="h-5 w-5 text-destructive" />
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
              <Shield className="h-5 w-5 text-destructive" />
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
              <Shield className="h-5 w-5 text-warning" />
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
              <Shield className="h-5 w-5 text-muted-foreground" />
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
