'use client';

import type { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { Fragment } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { StatusRadio } from '~/components/data-table/status-radio';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '~/components/data-table/table';
import { TableRowGroup } from '~/components/data-table/table-row-group';
import { TicketRowGroup } from '~/components/data-table/ticket-row-group';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [grouping] = React.useState(['priority']);
  const [sorting] = React.useState([
    {
      id: 'priority',
      desc: false,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
      rowSelection,
      expanded: true,
      sorting: sorting,
    },
    autoResetExpanded: false,
    enableExpanding: true,
    enableGrouping: true,
    enableRowSelection: true,
    enableSorting: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <StatusRadio />
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getExpandedRowModel().rows.length ? (
              table.getExpandedRowModel().rows.map((row) =>
                row.getIsGrouped() ? (
                  <TableRowGroup key={row.id} className="flex space-x-2">
                    <TicketRowGroup row={row} />
                  </TableRowGroup>
                ) : (
                  <TableRow
                    key={row.id}
                    to="/ticket/$ticketId"
                    params={{ ticketId: row.getValue('id') }}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Fragment key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Fragment>
                    ))}
                  </TableRow>
                ),
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
