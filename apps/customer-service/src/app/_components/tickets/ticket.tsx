'use client';

import { FC } from 'react';

import { MessageForm } from '~/app/_components/messages/message-form';
import { TicketHeader } from '~/app/_components/tickets/ticket-header';
import { TicketTimeline } from '~/app/_components/tickets/ticket-timeline';
import { useTicketQuery } from '~/graphql/generated/client';

export const Ticket: FC<{
  ticketId: string;
}> = ({ ticketId }) => {
  const { data: ticketData } = useTicketQuery(
    { id: ticketId },
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
