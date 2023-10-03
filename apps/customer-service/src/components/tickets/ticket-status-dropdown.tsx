import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { RouterOutputs } from '@cs/api';
import { TicketStatus } from '@cs/database/schema/ticket';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useReopenTicket } from '~/hooks/useReopenTicket';
import { useResolveTicket } from '~/hooks/useResolveTicket';

type TicketChangeAssignmentProps = {
  status?: NonNullable<RouterOutputs['ticket']['byId']>['status'];
  ticketId: number;
};

export const TicketStatusDropdowm: FC<TicketChangeAssignmentProps> = ({
  status,
  ticketId,
}) => {
  const { resolveTicket } = useResolveTicket();
  const { reopenTicket } = useReopenTicket();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex h-auto items-center justify-between gap-x-1 px-2 text-sm leading-6"
        >
          <div className="flex items-center gap-x-2">
            {status === TicketStatus.Open ? (
              <>
                <div className="h-4 w-4 rounded-full bg-destructive"></div>
                <p className="text-xs text-muted-foreground">
                  <FormattedMessage id="ticket.statuses.open" />
                </p>
              </>
            ) : (
              <>
                <div className="h-4 w-4 rounded-full bg-valid"></div>
                <p className="text-xs text-muted-foreground">
                  <FormattedMessage id="ticket.statuses.resolved" />
                </p>
              </>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            key="open"
            onClick={() => reopenTicket({ id: ticketId })}
            disabled={status === TicketStatus.Open}
          >
            <div className="flex items-center gap-x-2">
              <div className="h-5 w-5 rounded-full bg-destructive"></div>
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.statuses.open" />
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="resolved"
            onClick={() => resolveTicket({ id: ticketId })}
            disabled={status === TicketStatus.Resolved}
          >
            <div className="flex items-center gap-x-2">
              <div className="h-5 w-5 rounded-full bg-valid"></div>
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.statuses.resolved" />
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
