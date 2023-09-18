'use client';

import { FC } from 'react';

import { MessageForm } from '~/components/messages/message-form';
import { MessageList } from '~/components/messages/message-list';
import { TicketContainer } from '~/components/tickets/ticket-container';
import { TicketHeader } from '~/components/tickets/ticket-header';
import { api } from '~/utils/api';
import { AttachmentProvider } from '~/utils/use-attachment';

export const Ticket: FC<{
  ticketId: number;
}> = ({ ticketId }) => {
  const [ticketData] = api.ticket.byId.useSuspenseQuery({ id: ticketId });

  if (!ticketData) return null;

  return (
    <AttachmentProvider>
      <TicketContainer ticketId={ticketId}>
        <TicketHeader ticketId={ticketId} />

        <MessageList ticketId={ticketId} />
        <MessageForm ticketId={ticketId} />
      </TicketContainer>
    </AttachmentProvider>
  );
};

Ticket.displayName = 'Ticket';
