'use client';

import { FC, Fragment, useEffect } from 'react';
import { PartyPopper } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { FormattedMessage } from 'react-intl';

import { TicketFilter, TicketStatus } from '@cs/kyaku/models';
import { SortDirection } from '@cs/kyaku/types';

import { TicketListItem } from '~/components/tickets/ticket-list-item';
import { TicketListItemSkeleton } from '~/components/tickets/ticket-list-item-skeleton';
import { api } from '~/lib/api';

export const TicketList: FC<{
  filter: TicketFilter | string;
  status: TicketStatus;
  orderBy: 'newest' | 'oldest';
}> = ({ filter, status, orderBy }) => {
  const { ref, inView } = useInView();

  const [data, allTicketsQuery] = api.ticket.all.useSuspenseInfiniteQuery(
    {
      filters: {
        status: {
          in: [status],
        },
      },
      sortBy: {
        createdAt:
          orderBy === 'newest' ? SortDirection.DESC : SortDirection.ASC,
      },
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    }
  );
  const [sessionData] = api.auth.getSession.useSuspenseQuery();

  const { isFetching, fetchNextPage, hasNextPage } = allTicketsQuery;

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
                  <TicketListItem
                    key={ticket.id}
                    ticket={ticket}
                    currentUserId={sessionData?.user.id}
                  />
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
