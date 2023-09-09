'use client';

import { FC } from 'react';

import { TicketListItem } from '~/components/tickets/ticket-list-item';
import { useTicket } from '~/hooks/useTicket/TicketProvider';

export const TicketList: FC = () => {
  const { tickets } = useTicket();
  return (
    <div className="divide-y">
      {tickets.map((ticket) => (
        <TicketListItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};
