'use client';

import { FC } from 'react';
import { useParams } from 'next/navigation';

import { MessageForm } from '~/components/messages/message-form';
import { MessageList } from '~/components/messages/message-list';
import { TicketHeader } from '~/components/tickets/ticket-header';
import { api } from '~/utils/api';

export const Ticket: FC = () => {
  const params = useParams();
  const ticketId = parseInt(params.id ?? '');
  const { data: ticketData } = api.ticket.byId.useQuery(
    { id: ticketId },
    { enabled: !!ticketId }
  );

  if (!ticketData) return null;

  return (
    <>
      <TicketHeader id={ticketId} />

      <MessageList id={ticketId} />
      <MessageForm id={ticketId} />
    </>
  );
};

Ticket.displayName = 'Ticket';
