import { useSearch } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';

import { TicketFilter } from '@cs/kyaku/models';

import { TicketDropdownSort } from '~/components/tickets/ticket-dropdown-sort';

export const TicketListHeader = () => {
  const searchParams = useSearch({ from: '/_authed/ticket/_layout' });

  let inboxName;
  if (searchParams.filter === TicketFilter.Me) {
    inboxName = <FormattedMessage id="layout.tickets.my_tickets" />;
  } else if (searchParams.filter === TicketFilter.Unassigned) {
    inboxName = <FormattedMessage id="layout.tickets.unassigned_tickets" />;
  } else {
    inboxName = <FormattedMessage id="layout.tickets.all_tickets" />;
  }

  return (
    <header className="flex items-center justify-between border-b px-4 py-6 sm:px-6">
      <h1 className="text-base font-semibold leading-10 text-foreground">
        {inboxName}
      </h1>

      <TicketDropdownSort orderBy={searchParams.orderBy} />
    </header>
  );
};
