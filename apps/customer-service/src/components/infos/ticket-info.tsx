import { FC } from 'react';
import { Star, StarOff } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketAssignmentCombobox } from '~/components/tickets/ticket-assignment-combobox';
import { TicketStatusDropdowm } from '~/components/tickets/ticket-status-dropdown';
import { Button } from '~/components/ui/button';
import { api } from '~/lib/api';

export const TicketInfo: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({
    id: ticketId,
  });

  if (!ticketData) {
    return null;
  }

  return (
    <dl className="grid grid-cols-[5rem,_1fr] items-center gap-x-3 gap-y-2 border-b py-4">
      <dt className="text-sm leading-8">
        <FormattedMessage id="info_panel.ticket_panel.status" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        <TicketStatusDropdowm status={ticketData?.status} ticketId={ticketId} />
      </dd>

      <dt className="text-sm leading-8">
        <FormattedMessage id="info_panel.ticket_panel.assignee" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        <TicketAssignmentCombobox
          assignedTo={ticketData?.assignedTo}
          ticketId={ticketId}
        />
      </dd>

      <dt className="text-sm leading-8">
        <FormattedMessage id="info_panel.ticket_panel.priority" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        {ticketData.priority ? (
          <Button type="button" variant={'ghost'} className="gap-x-2 px-2">
            <Star className="h-4 w-4 text-warning" />
            <p className="text-xs text-muted-foreground">
              <FormattedMessage id="ticket.priorities.priority" />
            </p>
          </Button>
        ) : (
          <Button
            type="button"
            variant={'ghost'}
            className="h-auto gap-x-2 p-2 text-xs"
          >
            <StarOff className="h-4 w-4 text-warning" />
            <p className="text-xs text-muted-foreground">
              <FormattedMessage id="ticket.priorities.non_priority" />
            </p>
          </Button>
        )}
      </dd>
    </dl>
  );
};
