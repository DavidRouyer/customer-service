'use client';

import { FC, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PartyPopper } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/database/schema/ticket';

import { TicketListItem } from '~/components/tickets/ticket-list-item';
import { api } from '~/utils/api';

export const TicketList: FC<{
  filter: 'all' | 'me' | 'unassigned';
  status: TicketStatus;
  orderBy: 'newest' | 'oldest';
}> = ({ filter, status, orderBy }) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [ticketsData] = api.ticket.all.useSuspenseQuery({
    filter: filter,
    status: status,
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
    <div className="no-scrollbar flex-auto overflow-y-auto">
      {ticketsData?.length > 0 ? (
        ticketsData.map((ticket) => (
          <TicketListItem key={ticket.id} ticket={ticket} />
        ))
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
