'use client';

import { FC } from 'react';

import { MessageForm } from '~/components/MessageForm/MessageForm';
import { MessageList } from '~/components/MessageList/MessageList';
import { TicketHeader } from '~/components/TicketHeader/TicketHeader';
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
