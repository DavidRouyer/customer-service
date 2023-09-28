'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { TicketStatus } from '@cs/database/schema/ticket';

import { TicketList } from '~/components/tickets/ticket-list';
import { TicketListHeader } from '~/components/tickets/ticket-list-header';
import { TicketListItemSkeleton } from '~/components/tickets/ticket-list-item-skeleton';
import { TicketListNavigation } from '~/components/tickets/ticket-list-navigation';
import {
  FILTER_QUERY_PARAM,
  ORDER_BY_QUERY_PARAM,
  STATUS_QUERY_PARAM,
} from '~/utils/search-params';

export const TicketListContainer = () => {
  const searchParams = useSearchParams();
  const filter =
    searchParams.get(FILTER_QUERY_PARAM) === 'me'
      ? 'me'
      : searchParams.get(FILTER_QUERY_PARAM) === 'unassigned'
      ? 'unassigned'
      : 'all';
  const status =
    searchParams.get(STATUS_QUERY_PARAM) === 'resolved'
      ? TicketStatus.Resolved
      : TicketStatus.Open;
  const orderBy =
    searchParams.get(ORDER_BY_QUERY_PARAM) === 'oldest' ? 'oldest' : 'newest';
  return (
    <aside className="fixed inset-y-0 left-60 hidden w-96 flex-col border-r xl:flex">
      <TicketListHeader />
      <TicketListNavigation status={status} orderBy={orderBy} />
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
