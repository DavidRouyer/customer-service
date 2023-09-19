import { LayoutWithSidebar } from '~/app/tickets/layout-with-sidebar';
import { TicketListContainer } from '~/components/tickets/ticket-list-container';

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <LayoutWithSidebar>
      {children}

      <TicketListContainer />
    </LayoutWithSidebar>
  );
}
