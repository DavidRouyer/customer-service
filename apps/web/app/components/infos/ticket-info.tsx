import { useParams } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';

import { TicketAssignmentCombobox } from '~/components/tickets/ticket-assignment-combobox';
import { TicketLabelCombobox } from '~/components/tickets/ticket-label-combobox';
import { TicketPriorityDropdowm } from '~/components/tickets/ticket-priority-dropdown';
import { TicketStatusDropdowm } from '~/components/tickets/ticket-status-dropdown';
import { useSuspenseTicketQuery } from '~/graphql/generated/client';

export const TicketInfo = () => {
  const { ticketId } = useParams({ from: '/_authed/ticket/_layout/$ticketId' });
  const { data: ticketData } = useSuspenseTicketQuery(
    {
      ticketId: ticketId,
    },
    {
      select: (data) => data.ticket,
    },
  );

  if (!ticketData) {
    return null;
  }

  return (
    <dl className="grid grid-cols-[5rem,_1fr] items-center gap-x-3 gap-y-2 border-b py-4">
      <dt className="text-sm leading-8">
        <FormattedMessage id="info_panel.ticket_panel.status" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        <TicketStatusDropdowm status={ticketData.status} ticketId={ticketId} />
      </dd>

      <dt className="text-sm leading-8">
        <FormattedMessage id="info_panel.ticket_panel.assignee" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        <TicketAssignmentCombobox
          assignedTo={ticketData.assignedTo}
          ticketId={ticketId}
        />
      </dd>

      <dt className="text-sm leading-8">
        <FormattedMessage id="info_panel.ticket_panel.label" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        <TicketLabelCombobox labels={ticketData.labels} ticketId={ticketId} />
      </dd>

      <dt className="text-sm leading-8">
        <FormattedMessage id="info_panel.ticket_panel.priority" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        <TicketPriorityDropdowm
          priority={ticketData.priority}
          ticketId={ticketId}
        />
      </dd>
    </dl>
  );
};
