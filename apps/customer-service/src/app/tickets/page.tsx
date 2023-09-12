import { redirect } from 'next/navigation';

import { auth } from '@cs/auth';

export default async function TicketsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return null;
}

TicketsPage.displayName = 'TicketsPage';
