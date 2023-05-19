import { FC } from 'react';

import { Ticket } from '@/components/TicketList/Ticket';
import { useConversation } from '@/hooks/useConversation/ConversationProvider';

export const TicketList: FC = () => {
  const { conversations } = useConversation();
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {conversations.map((ticket) => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
    </ul>
  );
};
