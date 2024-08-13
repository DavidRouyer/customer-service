import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { InfoPanel } from '~/app/_components/infos/info-panel';
import { Ticket } from '~/app/_components/tickets/ticket';
import { TicketNavbar } from '~/app/_components/tickets/ticket-navbar';

interface TicketPageProps {
  params: {
    id: string;
  };
}

export default function TicketPage({ params: { id } }: TicketPageProps) {
  if (!id) return notFound();

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
        <InfoPanel ticketId={id} />
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
              <Ticket ticketId={id} />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}

TicketPage.displayName = 'TicketPage';
