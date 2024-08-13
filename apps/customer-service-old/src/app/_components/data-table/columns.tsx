'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { CircleDashed, Plus } from 'lucide-react';

import { getInitials } from '@cs/kyaku/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@cs/ui/avatar';
import { Badge } from '@cs/ui/badge';
import { Checkbox } from '@cs/ui/checkbox';

import { TicketPriority } from '~/graphql/generated/client';
import type { TicketsQuery } from '~/graphql/generated/client';
import type { IconType } from '../../../../../../packages/ui/src/icon';
import { Icon } from '../../../../../../packages/ui/src/icon';
import { priorities, statuses } from './data';

export interface TicketData {
  assignedTo: TicketsQuery['tickets']['edges'][number]['node']['assignedTo'];
  customer: TicketsQuery['tickets']['edges'][number]['node']['customer']['name'];
  id: string;
  labels: TicketsQuery['tickets']['edges'][number]['node']['labels'];
  priority: TicketsQuery['tickets']['edges'][number]['node']['priority'];
  status: string;
  title: string;
}

export const columns: ColumnDef<TicketData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex p-2 align-middle">
        <Checkbox
          checked={row.getIsSelected()}
          onClick={(event) => {
            event.preventDefault();
            row.toggleSelected();
          }}
          aria-label="Select row"
          className="select-none"
        />
      </div>
    ),
    meta: {
      hideHeader: false,
    },
  },
  {
    accessorKey: 'priority',
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority')
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex p-2 align-middle">
          <div className="flex items-center">
            <priority.icon className="size-4" />
          </div>
        </div>
      );
    },
    meta: {
      hideHeader: true,
    },
    sortingFn: (a, b) => {
      const prioritiesToBeSorted = [
        TicketPriority.Critical,
        TicketPriority.High,
        TicketPriority.Medium,
        TicketPriority.Low,
      ];
      const priorityA = a.original.priority;
      const priorityB = b.original.priority;

      return (
        prioritiesToBeSorted.indexOf(priorityA) -
        prioritiesToBeSorted.indexOf(priorityB)
      );
    },
  },
  {
    accessorKey: 'customer',
    cell: ({ row }) => (
      <div className="flex p-2 align-middle">
        <div className="w-[120px]">{row.getValue('customer')}</div>
      </div>
    ),
    meta: {
      hideHeader: true,
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex p-2 align-middle">
          <div className="flex items-center">
            <status.icon className="size-4 text-muted-foreground" />
          </div>
        </div>
      );
    },
    meta: {
      hideHeader: true,
    },
  },
  {
    accessorKey: 'title',
    cell: ({ row }) => {
      return (
        <div className="flex min-w-0 p-2 align-middle">
          <div className="flex min-w-0 shrink">
            <span className="truncate font-medium">
              {row.getValue('title')}
            </span>
          </div>
        </div>
      );
    },
    meta: {
      hideHeader: true,
    },
  },
  {
    id: 'separator',
    cell: () => <div className="flex min-w-0 flex-initial grow flex-col"></div>,
    meta: {
      hideHeader: true,
    },
  },
  {
    accessorKey: 'labels',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {row.original.labels.map((label) => (
            <Badge
              key={label.id}
              variant="outline"
              className="shrink-0 space-x-1"
            >
              <Icon
                name={(label.labelType.icon as IconType) ?? 'tag'}
                className="size-4"
              />
              <span>{label.labelType.name}</span>
            </Badge>
          ))}
        </div>
      );
    },
    meta: {
      hideHeader: true,
    },
  },
  {
    accessorKey: 'assignee',
    cell: ({ row }) => (
      <div className="flex p-2 align-middle">
        {row.original.assignedTo ? (
          <div className="flex items-center gap-x-2">
            <Avatar className="size-4">
              <AvatarImage src={row.original.assignedTo.image ?? undefined} />
              <AvatarFallback>
                {getInitials(row.original.assignedTo.name ?? '')}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-x-2 text-xs">
            <CircleDashed className="size-4" />
          </div>
        )}
      </div>
    ),
    meta: {
      hideHeader: true,
    },
  },
];
