import { Suspense } from 'react';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { z } from 'zod';

import { TicketFilter, TicketStatus } from '@kyaku/kyaku/models';

import { TicketList } from '~/components/tickets/ticket-list';
import { TicketListHeader } from '~/components/tickets/ticket-list-header';
import { TicketListItemSkeleton } from '~/components/tickets/ticket-list-item-skeleton';

export const Route = createFileRoute('/_authed/ticket/_layout')({
  validateSearch: (search) =>
    z
      .object({
        filter: z.nativeEnum(TicketFilter).optional().default(TicketFilter.All),
        orderBy: z.enum(['oldest', 'newest']).optional().default('newest'),
        status: z
          .nativeEnum(TicketStatus)
          .optional()
          .default(TicketStatus.Todo),
      })
      .parse(search),

  component: Layout,
});

function Layout() {
  const searchParams = Route.useSearch();
  return (
    <div>
      <Outlet />

      <aside className="fixed inset-y-0 left-14 hidden w-96 flex-col border-r xl:flex">
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
          <TicketList
            filter={searchParams.filter}
            status={searchParams.status}
            orderBy={searchParams.orderBy}
          />
        </Suspense>
      </aside>
    </div>
  );
}
