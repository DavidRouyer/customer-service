'use client';

import { FC } from 'react';

import { MessageForm } from '~/app/_components/messages/message-form';
import { TicketHeader } from '~/app/_components/tickets/ticket-header';
import { Timeline } from '~/app/_components/timeline/timeline';
import { api } from '~/trpc/react';

export const Ticket: FC<{
  ticketId: string;
}> = ({ ticketId }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({ id: ticketId });

  if (!ticketData) return null;

  return (
    <>
      <TicketHeader ticketId={ticketId} />

      <Timeline ticketId={ticketId} />
      <MessageForm ticketId={ticketId} />
    </>
  );
};

Ticket.displayName = 'Ticket';
