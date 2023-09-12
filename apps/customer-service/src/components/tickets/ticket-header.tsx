import { FC } from 'react';

import { TicketAssignment } from '~/components/tickets/ticket-assignment';
import { api } from '~/utils/api';

export const TicketHeader: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({ id: ticketId });

  return (
    <div className="flex items-center justify-between border-b pb-6">
      <h3 className="text-base font-semibold leading-6 text-foreground">
        <span className="text-muted-foreground">#{ticketData?.id}</span>{' '}
        {ticketData?.author.name}
      </h3>
      <TicketAssignment
        assignedTo={ticketData?.assignedTo}
        ticketId={ticketId}
      />
    </div>
  );
};

TicketHeader.displayName = 'TicketHeader';
