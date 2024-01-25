import { useSearchParams } from 'next/navigation';
import { FormattedMessage } from 'react-intl';

import { TicketFilter } from '@cs/kyaku/models';

import { TicketDropdownSort } from '~/components/tickets/ticket-dropdown-sort';
import { ORDER_BY_QUERY_PARAM } from '~/lib/search-params';

export const TicketListHeader = () => {
  const searchParams = useSearchParams();

  let inboxName;
  const filter = searchParams.get('filter');
  if (filter === TicketFilter.Me) {
    inboxName = <FormattedMessage id="layout.tickets.my_tickets" />;
  } else if (filter === TicketFilter.Unassigned) {
    inboxName = <FormattedMessage id="layout.tickets.unassigned_tickets" />;
  } else if (filter === TicketFilter.Mentions) {
    inboxName = <FormattedMessage id="layout.tickets.mentions" />;
  } else {
    inboxName = <FormattedMessage id="layout.tickets.all_tickets" />;
  }

  const orderBy =
    searchParams.get(ORDER_BY_QUERY_PARAM) === 'oldest' ? 'oldest' : 'newest';

  return (
    <header className="flex items-center justify-between border-b px-4 py-6 sm:px-6">
      <h1 className="text-base font-semibold leading-10 text-foreground">
        {inboxName}
      </h1>

      <TicketDropdownSort orderBy={orderBy} />
    </header>
  );
};
