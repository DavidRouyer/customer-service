'use client';

import { FC } from 'react';

import { MessageForm } from '~/components/messages/message-form';
import { TicketHeader } from '~/components/tickets/ticket-header';
import { TicketTimeline } from '~/components/timeline/ticket-timeline';
import { api } from '~/lib/api';

export const Ticket: FC<{
  ticketId: string;
}> = ({ ticketId }) => {
  const [ticketData] = api.ticket.byId.useSuspenseQuery({ id: ticketId });

  if (!ticketData) return null;

  return (
    <>
      <TicketHeader ticketId={ticketId} />

      <TicketTimeline ticketId={ticketId} />
      <MessageForm ticketId={ticketId} />
    </>
  );
};

Ticket.displayName = 'Ticket';
