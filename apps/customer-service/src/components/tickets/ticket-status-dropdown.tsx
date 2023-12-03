import { FC } from 'react';
import { CheckCircle2, CircleDot } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { RouterOutputs } from '@cs/api';
import { TicketStatus } from '@cs/lib/tickets';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { useReopenTicket } from '~/hooks/use-reopen-ticket';
import { useResolveTicket } from '~/hooks/use-resolve-ticket';

type TicketChangeAssignmentProps = {
  status?: NonNullable<RouterOutputs['ticket']['byId']>['status'];
  ticketId: string;
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
                <CircleDot className="h-4 w-4 text-warning" />
                <p className="text-xs text-muted-foreground">
                  <FormattedMessage id="ticket.statuses.open" />
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-valid" />
                <p className="text-xs text-muted-foreground">
                  <FormattedMessage id="ticket.statuses.done" />
                </p>
              </>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            key="open"
            onClick={() => reopenTicket({ id: ticketId })}
            disabled={status === TicketStatus.Open}
          >
            <div className="flex items-center gap-x-2">
              <CircleDot className="h-5 w-5 text-warning" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.statuses.open" />
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="done"
            onClick={() => resolveTicket({ id: ticketId })}
            disabled={status === TicketStatus.Done}
          >
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-valid" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.statuses.done" />
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
