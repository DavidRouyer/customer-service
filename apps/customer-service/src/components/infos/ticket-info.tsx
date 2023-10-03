import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/database/schema/ticket';

import { TicketChangeAssignment } from '~/components/tickets/ticket-change-assignment';
import { api } from '~/utils/api';

export const TicketInfo: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({
    id: ticketId,
  });

  if (!ticketData) {
    return null;
  }

  return (
    <dl className="grid grid-cols-[5rem,_1fr] items-center gap-x-3 gap-y-4 border-b py-4">
      <dt className="text-sm leading-5">
        <FormattedMessage id="info_panel.ticket_panel.status" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        {ticketData.status === TicketStatus.Open ? (
          <span>
            <FormattedMessage id="ticket.statuses.open" />
          </span>
        ) : (
          <span>
            <FormattedMessage id="ticket.statuses.resolved" />
          </span>
        )}
      </dd>

      <dt className="text-sm leading-5">
        <FormattedMessage id="info_panel.ticket_panel.assignee" />
      </dt>
      <dd className="truncate text-sm leading-5 text-muted-foreground">
        <TicketChangeAssignment
          assignedTo={ticketData?.assignedTo}
          ticketId={ticketId}
        />
      </dd>
    </dl>
  );
};
