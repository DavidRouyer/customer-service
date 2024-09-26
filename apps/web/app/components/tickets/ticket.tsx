'use client';

import { useParams } from '@tanstack/react-router';

import { MessageForm } from '~/components/messages/message-form';
import { TicketHeader } from '~/components/tickets/ticket-header';
import { TicketTimeline } from '~/components/tickets/ticket-timeline';
import { useSuspenseTicketQuery } from '~/graphql/generated/client';

export const Ticket = () => {
  const { ticketId } = useParams({ from: '/_authed/ticket/_layout/$ticketId' });
  const { data: ticketData } = useSuspenseTicketQuery(
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
