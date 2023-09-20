'use client';

import { FC, Fragment, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PartyPopper } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/database/schema/ticket';

import { TicketListItem } from '~/components/tickets/ticket-list-item';
import { TicketListItemSkeleton } from '~/components/tickets/ticket-list-item-skeleton';
import { api } from '~/utils/api';

export const TicketList: FC<{
  filter: 'all' | 'me' | 'unassigned';
  status: TicketStatus;
  orderBy: 'newest' | 'oldest';
}> = ({ filter, status, orderBy }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const [data, allTicketsQuery] = api.ticket.all.useSuspenseInfiniteQuery(
    {
      filter: filter,
      status: status,
      orderBy: orderBy,
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    }
  );

  const { isFetching, fetchNextPage, hasNextPage } = allTicketsQuery;

  useEffect(() => {
    if (
      !data.pages ||
      data.pages.length === 0 ||
      data?.pages?.flatMap((page) => page.data).length === 0 ||
      params.id
    )
      return;

    const firstTicketIdFromList = data.pages[0]?.data?.[0]?.id;
    if (!firstTicketIdFromList) return;

    router.replace(
      `/tickets/${firstTicketIdFromList}?${searchParams.toString()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="no-scrollbar flex-auto overflow-y-auto">
      {data?.pages?.flatMap((page) => page.data).length > 0 ? (
        <>
          <div>
            {data?.pages.map((page) => (
              <Fragment key={page.nextCursor}>
                {page.data.map((ticket) => (
                  <TicketListItem key={ticket.id} ticket={ticket} />
                ))}
              </Fragment>
            ))}
          </div>
          {isFetching && (
            <div className="flex w-full flex-col gap-4">
              <TicketListItemSkeleton />
              <TicketListItemSkeleton />
              <TicketListItemSkeleton />
            </div>
          )}
          <div ref={ref} className="h-px w-full" />
        </>
      ) : (
        <div className="py-10">
          <div className="text-center">
            <PartyPopper
              className="mx-auto h-12 w-12 text-gray-400"
              strokeWidth={1}
            />
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              <FormattedMessage id="tickets.no_tickets" />
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              <FormattedMessage id="tickets.all_tickets_processed" />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
