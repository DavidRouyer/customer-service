'use client';

import { FC, Fragment, useEffect } from 'react';
import { PartyPopper } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { FormattedMessage } from 'react-intl';

import { TicketFilter, TicketStatus } from '@cs/kyaku/models';
import { SortDirection } from '@cs/kyaku/types';

import { TicketListItem } from '~/app/_components/tickets/ticket-list-item';
import { TicketListItemSkeleton } from '~/app/_components/tickets/ticket-list-item-skeleton';
import { api } from '~/trpc/react';

export const TicketList: FC<{
  filter: TicketFilter | string;
  status: TicketStatus;
  orderBy: 'newest' | 'oldest';
}> = ({ filter, status, orderBy }) => {
  const { ref, inView } = useInView();

  const { data, isFetching, fetchNextPage, hasNextPage } =
    api.ticket.all.useInfiniteQuery(
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
        limit: 2,
      },
      {
        getNextPageParam(lastPage) {
          return lastPage.nextCursor;
        },
      }
    );
  const { data: session } = api.auth.getSession.useQuery();

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  const tickets = data?.pages?.flatMap((page) => page.data) ?? [];

  return (
    <div className="no-scrollbar flex-auto overflow-y-auto">
      {(tickets.length ?? 0) > 0 ? (
        <>
          <div>
            {tickets.map((ticket) => (
              <TicketListItem
                key={ticket.id}
                ticket={ticket}
                currentUserId={session?.user.id}
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
