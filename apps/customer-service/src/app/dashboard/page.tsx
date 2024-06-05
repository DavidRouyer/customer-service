'use client';

import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/kyaku/models';

import type { TicketData } from '~/app/_components/data-table/columns';
import { columns } from '~/app/_components/data-table/columns';
import { DataTable } from '~/app/_components/data-table/data-table';
import { useTicketsQuery } from '~/graphql/generated/client';

interface DashboardPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function DashboardPage({
  searchParams,
}: Readonly<DashboardPageProps>) {
  const { data: tickets } = useTicketsQuery(
    {
      filters: {
        statuses: [
          (searchParams.status as TicketStatus | undefined) ??
            TicketStatus.Open,
        ],
      },
    },
    {
      select(data) {
        return data.tickets.edges.map(
          (ticket) =>
            ({
              id: ticket.node.id,
              title: ticket.node.title ?? '',
              status: ticket.node.status,
              priority: ticket.node.priority,
              labels: ticket.node.labels.map((label) => ({
                id: label.id,
                labelType: {
                  id: label.labelType.id,
                  name: label.labelType.name,
                },
              })),
              assignedTo: ticket.node.assignedTo,
            }) satisfies TicketData
        );
      },
    }
  );
  return (
    <main className="py-10 lg:pl-60">
      <div className="space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">
          <FormattedMessage id="page.all_tickets" />
        </h2>

        <DataTable data={tickets ?? []} columns={columns} />
      </div>
    </main>
  );
}

DashboardPage.displayName = 'DashboardPage';
