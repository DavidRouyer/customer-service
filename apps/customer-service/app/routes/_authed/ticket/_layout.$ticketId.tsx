import { Suspense } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

import { InfoPanel } from '~/components/infos/info-panel';
import { Ticket } from '~/components/tickets/ticket';
import { TicketNavbar } from '~/components/tickets/ticket-navbar';

export const Route = createFileRoute('/_authed/ticket/_layout/$ticketId')({
  params: {
    parse: (params) => ({
      ticketId: z.string().parse(String(params.ticketId)),
    }),
    stringify: ({ ticketId }) => ({ ticketId: `${ticketId}` }),
  },
  component: TicketRoute,
});

function TicketRoute() {
  const params = Route.useParams();
  return (
    <>
      <TicketNavbar />
      <Suspense
        fallback={
          <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l px-4 py-6 sm:px-6 xl:block">
            <div className="flex size-full items-center justify-center">
              <Loader2 className="size-8 animate-spin" />
            </div>
          </aside>
        }
      >
        <InfoPanel ticketId={params.ticketId} />
      </Suspense>

      <main className="lg:pl-14">
        <div className="xl:mr-96 xl:h-dvh xl:overflow-y-auto xl:pl-96">
          <div className="flex h-dvh flex-col px-4 py-6 sm:px-6">
            <Suspense
              fallback={
                <div className="flex size-full items-center justify-center">
                  <Loader2 className="size-8 animate-spin" />
                </div>
              }
            >
              <Ticket ticketId={params.ticketId} />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
