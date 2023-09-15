import { Suspense } from 'react';

import { LayoutWithSidebar } from '~/app/tickets/layout-with-sidebar';
import { TicketList } from '~/components/tickets/ticket-list';
import { TicketListHeader } from '~/components/tickets/ticket-list-header';
import { TicketListItemSkeleton } from '~/components/tickets/ticket-list-item-skeleton';

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <LayoutWithSidebar>
      {children}

      <aside className="fixed inset-y-0 left-60 hidden w-96 flex-col border-r xl:flex">
        <TicketListHeader />
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              <TicketListItemSkeleton />
              <TicketListItemSkeleton />
              <TicketListItemSkeleton />
            </div>
          }
        >
          <TicketList />
        </Suspense>
      </aside>
    </LayoutWithSidebar>
  );
}
