import { Ticket } from '~/components/tickets/ticket';

export default function TicketsPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return <Ticket id={id} />;
}

TicketsPage.displayName = 'TicketsPage';
