import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { auth } from '@cs/auth';

import { InfoPanel } from '~/components/infos/info-panel';
import { Ticket } from '~/components/tickets/ticket';

export default async function TicketPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const ticketId = parseInt(id);

  if (!ticketId) return null;

  return (
    <>
      <Suspense
        fallback={
          <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l px-4 py-6 sm:px-6 xl:block">
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </aside>
        }
      >
        <InfoPanel ticketId={ticketId} />
      </Suspense>

      <main className="lg:pl-60">
        <div className="xl:mr-96 xl:h-[100dvh] xl:overflow-y-auto xl:pl-96">
          <div className="flex h-[100dvh] flex-col px-4 py-6 sm:px-6">
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <Ticket ticketId={ticketId} />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}

TicketPage.displayName = 'TicketPage';
