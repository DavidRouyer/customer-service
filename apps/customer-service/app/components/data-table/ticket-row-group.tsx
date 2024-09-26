import type { Row } from '@tanstack/react-table';

import { TicketPriorityBadge } from '@kyaku/ui/ticket-priority-badge';

export function TicketRowGroup<TData>({ row }: { row: Row<TData> }) {
  if (row.groupingColumnId === 'priority') {
    return <TicketPriorityBadge priority={row.getValue('priority')} />;
  }
  return null;
}
