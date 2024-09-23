import { createFileRoute } from '@tanstack/react-router';
import { FormattedMessage } from 'react-intl';
import { z } from 'zod';

import { TicketStatus } from '@cs/kyaku/models';

import type { TicketData } from '~/components/data-table/columns';
import { columns } from '~/components/data-table/columns';
import { DataTable } from '~/components/data-table/data-table';
import { useTicketsQuery } from '~/graphql/generated/client';

export const Route = createFileRoute('/_authed/_layout/')({
  validateSearch: (search) =>
    z
      .object({
        statuses: z
          .nativeEnum(TicketStatus)
          .optional()
          .default(TicketStatus.Todo),
      })
      .parse(search),
  component: Layout,
});

function Layout() {
  const searchParams = Route.useSearch();
  const { data: tickets } = useTicketsQuery(
    {
      filters: {
        statuses: [searchParams.statuses],
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
              labels: ticket.node.labels,
              assignedTo: ticket.node.assignedTo,
              customer: ticket.node.customer.name,
            }) satisfies TicketData
        );
      },
    }
  );

  return (
    <div className="space-y-4 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight">
        <FormattedMessage id="page.all_tickets" />
      </h2>

      <DataTable data={tickets ?? []} columns={columns} />
    </div>
  );
}
