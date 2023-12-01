'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Checkbox } from '~/components/ui/checkbox';
import { getInitials } from '~/lib/string';
import { Contact } from '~/types/Contact';
import { priorities, statuses } from './data';

export type TicketData = {
  id: string;
  title: string;
  status: string;
  labels: {
    id: string;
    labelType: {
      id: string;
      name: string;
    };
  }[];
  priority: string;
  assignedTo: Contact | null;
};

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
          //onCheckedChange={(value) => row.toggleSelected(!!value)}
          onClick={(event) => {
            //event.stopPropagation();
            event.preventDefault();
            row.toggleSelected(!row.getIsSelected());
          }}
          aria-label="Select row"
          className="select-none"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
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
            {priority.icon && (
              <priority.icon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'id',
    cell: ({ row }) => (
      <div className="flex p-2 align-middle">
        <div className="w-[120px]">{row.getValue('id')}</div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
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
            {status.icon && (
              <status.icon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
  },
  {
    id: 'separator',
    cell: () => <div className="flex min-w-0 flex-initial grow flex-col"></div>,
  },
  {
    accessorKey: 'labels',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {row.original.labels.map((label) => (
            <Badge key={label.labelType.id} variant="outline">
              {label.labelType.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'assignee',
    cell: ({ row }) => (
      <div className="flex p-2 align-middle">
        {row.original.assignedTo ? (
          <div className="flex items-center gap-x-2">
            <Avatar className="h-4 w-4">
              <AvatarImage
                src={row.original.assignedTo?.avatarUrl ?? undefined}
              />
              <AvatarFallback>
                {getInitials(row.original.assignedTo?.name ?? '')}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-x-2 text-xs">
            <Plus className="h-4 w-4" />
          </div>
        )}
      </div>
    ),
  },
];
