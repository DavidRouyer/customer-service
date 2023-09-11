'use client';

import { FC, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { TicketListItem } from '~/components/tickets/ticket-list-item';
import { api } from '~/utils/api';

export const TicketList: FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter =
    searchParams.get('filter') === 'me'
      ? 'me'
      : searchParams.get('filter') === 'unassigned'
      ? 'unassigned'
      : 'all';
  const orderBy =
    searchParams.get('orderBy') === 'oldest' ? 'oldest' : 'newest';
  const { data: ticketsData } = api.ticket.all.useQuery({
    filter: filter,
    orderBy: orderBy,
  });

  useEffect(() => {
    if (!ticketsData || ticketsData.length === 0 || params.id) return;

    const firstTicketIdFromList = ticketsData?.[0]?.id;
    if (!firstTicketIdFromList) return;

    router.replace(
      `/tickets/${firstTicketIdFromList}?${searchParams.toString()}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketsData]);

  return (
    <div className="divide-y">
      {ticketsData?.map((ticket) => (
        <TicketListItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};
