'use client';

import type { FC } from 'react';
import { useEffect } from 'react';
import { PartyPopper } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { FormattedMessage } from 'react-intl';

import type { TicketFilter, TicketStatus } from '@cs/kyaku/models';

import { TicketListItem } from '~/app/_components/tickets/ticket-list-item';
import { TicketListItemSkeleton } from '~/app/_components/tickets/ticket-list-item-skeleton';
import {
  useInfiniteTicketsQuery,
  useMyUserInfoQuery,
} from '~/graphql/generated/client';

export const TicketList: FC<{
  filter: TicketFilter | string;
  status: TicketStatus;
  orderBy: 'newest' | 'oldest';
}> = ({ filter, status, orderBy }) => {
  const { ref, inView } = useInView();
  console.log('filter', filter, 'status', status, 'orderBy', orderBy);

  const {
    data: tickets,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteTicketsQuery(
    {
      filters: {
        statuses: [status],
      },
      first: 10,
    },
    {
      initialPageParam: 0,
      getNextPageParam(lastPage) {
        if (!lastPage.tickets.pageInfo.hasNextPage) return undefined;
        return lastPage.tickets.pageInfo.endCursor;
      },
      select: (data) => data.pages.flatMap((page) => page.tickets.edges),
    }
  );
  const { data: myUserInfo } = useMyUserInfoQuery(undefined, {
    select: (data) => ({ user: data.myUserInfo }),
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="no-scrollbar flex-auto overflow-y-auto">
      {tickets && tickets.length > 0 ? (
        <>
          <div>
            {tickets.map((ticket) => (
              <TicketListItem
                key={ticket.node.id}
                ticket={ticket.node}
                currentUserId={myUserInfo?.user?.id}
              />
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
              className="mx-auto size-12 text-gray-400"
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
