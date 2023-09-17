import { Suspense } from 'react';
import { redirect } from 'next/navigation';

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
      <Suspense fallback={null}>
        <InfoPanel ticketId={ticketId} />
      </Suspense>

      <main className="lg:pl-60">
        <div className="xl:mr-96 xl:h-[100dvh] xl:overflow-y-auto xl:pl-96">
          <Suspense fallback={null}>
            <Ticket ticketId={ticketId} />
          </Suspense>
        </div>
      </main>
    </>
  );
}

TicketPage.displayName = 'TicketPage';
