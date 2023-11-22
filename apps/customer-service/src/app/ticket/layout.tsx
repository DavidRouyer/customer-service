import { redirect } from 'next/navigation';

import { auth } from '@cs/auth';

import { TicketListContainer } from '~/components/tickets/ticket-list-container';

type TicketLayoutProps = {
  children: React.ReactNode;
};

export default async function TicketLayout({ children }: TicketLayoutProps) {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return (
    <div>
      {children}

      <TicketListContainer />
    </div>
  );
}
