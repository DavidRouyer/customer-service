import { FC } from 'react';

import { TicketListItem } from '@/components/TicketList/TicketListItem';
import { useTicket } from '@/hooks/useTicket/TicketProvider';

export const TicketList: FC = () => {
  const { tickets } = useTicket();
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {tickets.map((ticket) => (
        <TicketListItem key={ticket.id} ticket={ticket} />
      ))}
    </ul>
  );
};
