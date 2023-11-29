'use client';

import { FormattedMessage } from 'react-intl';

import { TicketFilter, TicketStatus } from '@cs/lib/tickets';

import { columns } from '~/components/data-table/columns';
import { DataTable } from '~/components/data-table/data-table';
import { api } from '~/lib/api';

export default function DashboardPage() {
  const { data: tickets } = api.ticket.all.useQuery(
    {
      filter: TicketFilter.All,
      orderBy: 'newest',
      status: TicketStatus.Open,
    },
    {
      select(data) {
        return data.data.map((ticket) => ({
          id: ticket.id,
          title: ticket.title,
          status: ticket.status as string,
          priority: ticket.priority as string,
          labels: ticket.labels,
          assignedTo: ticket.assignedTo,
        }));
      },
    }
  );
  return (
    <main className="py-10 lg:pl-60">
      <div className="px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">
          <FormattedMessage id="page.all_tickets" />
        </h2>

        <DataTable data={tickets ?? []} columns={columns} />
      </div>
    </main>
  );
}

DashboardPage.displayName = 'DashboardPage';
