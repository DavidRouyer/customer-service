import { Ticket } from '~/components/tickets/ticket';

export default function TicketPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const ticketId = parseInt(id);

  if (!ticketId) return null;

  return <Ticket ticketId={ticketId} />;
}

TicketPage.displayName = 'TicketPage';
