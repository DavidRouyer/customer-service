import type { FC } from 'react';
import { CheckCircle2, CircleDot } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@kyaku/kyaku/models';
import { Button } from '@kyaku/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kyaku/ui/dropdown-menu';

import { useMarkAsDoneTicket } from '~/hooks/use-mark-as-done-ticket';
import { useMarkAsTodoTicket } from '~/hooks/use-mark-as-todo-ticket';

interface TicketChangeAssignmentProps {
  status?: TicketStatus;
  ticketId: string;
}

export const TicketStatusDropdowm: FC<TicketChangeAssignmentProps> = ({
  status,
  ticketId,
}) => {
  const { mutate: markAsDoneTicket } = useMarkAsDoneTicket();
  const { mutate: markAsOpenTicket } = useMarkAsTodoTicket();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="flex h-auto items-center justify-between gap-x-1 px-2 text-sm leading-6"
        >
          <div className="flex items-center gap-x-2">
            {status === TicketStatus.Todo ? (
              <>
                <CircleDot className="size-4 text-warning" />
                <p className="text-xs text-muted-foreground">
                  <FormattedMessage id="ticket.statuses.todo" />
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4 text-valid" />
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
            onClick={() => markAsOpenTicket({ input: { ticketId: ticketId } })}
            disabled={status === TicketStatus.Todo}
          >
            <div className="flex items-center gap-x-2">
              <CircleDot className="size-5 text-warning" />
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="ticket.statuses.todo" />
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="done"
            onClick={() => markAsDoneTicket({ input: { ticketId: ticketId } })}
            disabled={status === TicketStatus.Done}
          >
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="size-5 text-valid" />
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
