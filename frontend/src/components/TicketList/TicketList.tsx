import { FC } from 'react';

import { Ticket } from '@/components/TicketList/Ticket';
import { useTicket } from '@/hooks/useTicket/TicketProvider';

export const TicketList: FC = () => {
  const { tickets } = useTicket();
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {tickets.map((ticket) => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
    </ul>
  );
};
