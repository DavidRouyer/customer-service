'use client';

import { FC } from 'react';

import { MessageForm } from '~/components/messages/message-form';
import { MessageList } from '~/components/messages/message-list';
import { TicketHeader } from '~/components/tickets/ticket-header';
import { api } from '~/lib/api';

export const Ticket: FC<{
  ticketId: string;
}> = ({ ticketId }) => {
  const [ticketData] = api.ticket.byId.useSuspenseQuery({ id: ticketId });

  if (!ticketData) return null;

  return (
    <>
      <TicketHeader ticketId={ticketId} />

      <MessageList ticketId={ticketId} />
      <MessageForm ticketId={ticketId} />
    </>
  );
};

Ticket.displayName = 'Ticket';
