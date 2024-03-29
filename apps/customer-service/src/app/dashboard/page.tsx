'use client';

import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/kyaku/models';
import { SortDirection } from '@cs/kyaku/types';

import { columns, TicketData } from '~/app/_components/data-table/columns';
import { DataTable } from '~/app/_components/data-table/data-table';
import { api } from '~/trpc/react';

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { data: tickets } = api.ticket.all.useQuery(
    {
      filters: {
        status: {
          in: [(searchParams.status as TicketStatus) ?? TicketStatus.Open],
        },
      },
      sortBy: {
        createdAt: SortDirection.DESC,
      },
    },
    {
      select(data) {
        return data.data.map(
          (ticket) =>
            ({
              id: ticket.id,
              title: ticket.title ?? '',
              status: ticket.status as string,
              priority: ticket.priority as string,
              labels: ticket.labels.map((label) => ({
                id: label.id,
                labelType: {
                  id: label.labelType.id,
                  name: label.labelType.name,
                },
              })),
              assignedTo: ticket.assignedTo,
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
