import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { TicketStatus } from '@kyaku/kyaku/models';

import { TicketDataTable } from '~/components/data-table/ticket-data-table';

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
  return <TicketDataTable />;
}
