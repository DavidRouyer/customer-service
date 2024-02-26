'use client';

import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/kyaku/models';
import { SortDirection } from '@cs/kyaku/types';
import { SmartTabs } from '@cs/ui';

import { columns, TicketData } from '~/components/data-table/columns';
import { DataTable } from '~/components/data-table/data-table';
import { api } from '~/lib/api';

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
  const [selectedTab, setSelectedTab] = useState('a');
  const tabs = [
    {
      id: 'a',
      value: 'a',
      content: 'All customers',
    },
    {
      id: 'b',
      value: 'b',
      content: 'Accepts marketing',
    },
    {
      id: 'c',
      value: 'c',
      content: 'Repeat customers',
    },
    {
      id: 'd',
      value: 'd',
      content: 'Prospects',
    },
    {
      id: 'e',
      value: 'e',
      content: 'France',
    },
    {
      id: 'f',
      value: 'f',
      content: 'Allemagne',
    },
    {
      id: 'g',
      value: 'g',
      content: 'Etats-Unis',
    },
    {
      id: 'h',
      value: 'h',
      content: 'Guinée-Bissau',
    },
    {
      id: 'i',
      value: 'i',
      content: 'Corée du Nord',
    },
    {
      id: 'j',
      value: 'j',
      content: 'Corée du Sud',
    },
    {
      id: 'k',
      value: 'k',
      content: 'Japon',
    },
    {
      id: 'l',
      value: 'l',
      content: 'Chine',
    },
    {
      id: 'm',
      value: 'm',
      content: 'Hong-Kong',
    },
  ];

  return (
    <main className="py-10 lg:pl-60">
      <div className="space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">
          <FormattedMessage id="page.all_tickets" />
        </h2>

        <SmartTabs
          onValueChange={(value) => setSelectedTab(value)}
          tabs={tabs}
          selected={tabs.findIndex((tab) => tab.id === selectedTab)}
          value={selectedTab}
        />
        <DataTable data={tickets ?? []} columns={columns} />
      </div>
    </main>
  );
}

DashboardPage.displayName = 'DashboardPage';
