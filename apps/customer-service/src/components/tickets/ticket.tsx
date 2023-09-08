'use client';

import { FC } from 'react';

import { MessageForm } from '~/components/messages/message-form';
import { MessageList } from '~/components/messages/message-list';
import { TicketHeader } from '~/components/tickets/ticket-header';
import { useSetupTicketList } from '~/hooks/useSetupTicketList';
import { useTicket } from '~/hooks/useTicket/TicketProvider';

export const Ticket: FC = () => {
  useSetupTicketList();

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

Ticket.displayName = 'Ticket';
