'use client';

import type { FC } from 'react';

import { MessageForm } from '~/components/messages/message-form';
import { TicketHeader } from '~/components/tickets/ticket-header';
import { TicketTimeline } from '~/components/tickets/ticket-timeline';
import { useTicketQuery } from '~/graphql/generated/client';

export const Ticket: FC<{
  ticketId: string;
}> = ({ ticketId }) => {
  const { data: ticketData } = useTicketQuery(
    { ticketId: ticketId },
    {
      select: (data) => data.ticket,
    }
  );

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
