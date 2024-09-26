import { useSearch } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';

import { columns } from '~/components/data-table/columns';
import { DataTable } from '~/components/data-table/data-table';
import { useTicketsQuery } from '~/graphql/generated/client';

export function TicketDataTable() {
  const searchParams = useSearch({ from: '/_authed/_layout/' });
  const { data: tickets, isLoading } = useTicketsQuery(
    {
      filters: {
        statuses: [searchParams.statuses],
      },
    },
    {
      select(data) {
        return data.tickets.edges.map((ticket) => ({
          id: ticket.node.id,
          title: ticket.node.title ?? '',
          status: ticket.node.status,
          priority: ticket.node.priority,
          labels: ticket.node.labels,
          assignedTo: ticket.node.assignedTo,
          customer: ticket.node.customer.name,
        }));
      },
    }
  );

  if (isLoading) {
    return <div className="space-y-4 px-4 sm:px-6 lg:px-8">Loading...</div>;
  }

  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight">
        <FormattedMessage id="page.all_tickets" />
      </h2>

      <DataTable data={tickets ?? []} columns={columns} />
    </div>
  );
}
