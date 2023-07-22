import { FC } from 'react';

import { MessageForm } from '@/components/MessageForm/MessageForm';
import { MessageList } from '@/components/MessageList/MessageList';
import { TicketHeader } from '@/components/TicketHeader/TicketHeader';
import { useTicket } from '@/hooks/useTicket/TicketProvider';

export const Component: FC = () => {
  const { activeTicket } = useTicket();

  if (!activeTicket) return null;

  return (
    <>
      <TicketHeader />

      <MessageList />
      <MessageForm />
    </>
  );
};

Component.displayName = 'Ticket';
