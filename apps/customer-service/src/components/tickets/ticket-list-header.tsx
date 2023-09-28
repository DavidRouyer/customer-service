import { useSearchParams } from 'next/navigation';
import { FormattedMessage } from 'react-intl';

export const TicketListHeader = () => {
  const searchParams = useSearchParams();

  return (
    <header className="flex items-center justify-between border-b px-4 py-6 sm:px-6">
      <h1 className="text-base font-semibold leading-10 text-white">
        {searchParams.get('filter') === 'me' ? (
          <FormattedMessage id="layout.tickets.my_tickets" />
        ) : searchParams.get('filter') === 'unassigned' ? (
          <FormattedMessage id="layout.tickets.unassigned_tickets" />
        ) : (
          <FormattedMessage id="layout.tickets.all_tickets" />
        )}
      </h1>
    </header>
  );
};
