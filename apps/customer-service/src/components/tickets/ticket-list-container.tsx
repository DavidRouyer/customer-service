'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { TicketStatus } from '@cs/kyaku/models';

import { TicketList } from '~/components/tickets/ticket-list';
import { TicketListHeader } from '~/components/tickets/ticket-list-header';
import { TicketListItemSkeleton } from '~/components/tickets/ticket-list-item-skeleton';
import {
  FILTER_QUERY_PARAM,
  ORDER_BY_QUERY_PARAM,
  parseFilters,
  STATUS_QUERY_PARAM,
} from '~/lib/search-params';

export const TicketListContainer = () => {
  const searchParams = useSearchParams();
  searchParams.get(FILTER_QUERY_PARAM);
  const filter = parseFilters(searchParams.get(FILTER_QUERY_PARAM));
  const status =
    searchParams.get(STATUS_QUERY_PARAM) === 'done'
      ? TicketStatus.Done
      : TicketStatus.Open;
  const orderBy =
    searchParams.get(ORDER_BY_QUERY_PARAM) === 'oldest' ? 'oldest' : 'newest';
  return (
    <aside className="fixed inset-y-0 left-14 hidden w-96 flex-col border-r xl:flex">
      <TicketListHeader />
      <Suspense
        fallback={
          <div className="flex w-full flex-col gap-4">
            <TicketListItemSkeleton />
            <TicketListItemSkeleton />
            <TicketListItemSkeleton />
          </div>
        }
      >
        <TicketList filter={filter} status={status} orderBy={orderBy} />
      </Suspense>
    </aside>
  );
};
