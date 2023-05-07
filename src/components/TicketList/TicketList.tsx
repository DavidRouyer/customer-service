import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { Ticket } from '@/components/TicketList/Ticket';
import { ticketListState } from '@/stores/ticketList';

export const TicketList: FC = () => {
  const ticketList = useRecoilValue(ticketListState);
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {ticketList.map((ticket) => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
    </ul>
  );
};
