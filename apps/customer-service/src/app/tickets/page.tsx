import { redirect } from 'next/navigation';

import { auth } from '@cs/auth';

import { Ticket } from '~/components/tickets/ticket';

export default async function TicketsPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }
  return <Ticket />;
}

TicketsPage.displayName = 'TicketsPage';
