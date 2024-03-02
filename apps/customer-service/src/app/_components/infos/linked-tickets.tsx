'use client';

import { FC } from 'react';
import Link from 'next/link';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/kyaku/models';
import { SortDirection } from '@cs/kyaku/types';
import { Badge } from '@cs/ui/badge';

import { api } from '~/trpc/react';

type LinkedTicketsProps = {
  ticketId: string;
  customerId?: string;
};

export const LinkedTickets: FC<LinkedTicketsProps> = ({
  ticketId,
  customerId,
}) => {
  const { data: ticketsData } = api.ticket.all.useQuery(
    {
      filters: {
        customer: {
          eq: customerId ?? '',
        },
        ticketId: {
          ne: ticketId,
        },
      },
      sortBy: {
        createdAt: SortDirection.DESC,
      },
    },
    {
      enabled: !!customerId,
    }
  );

  return (
    <ul className="flex flex-col gap-y-1">
      {ticketsData?.data.map((ticket) => (
        <li key={ticket.id}>
          <Link
            href={`/ticket/${ticket.id}`}
            className="block flex-auto rounded-md p-3 ring-1 ring-inset ring-border"
          >
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-foreground">
                #{ticket.id}
              </p>
              <Badge
                variant={
                  (
                    {
                      Done: 'success',
                      Open: 'neutral',
                    } as const
                  )[ticket.status]
                }
                className="mt-0.5 whitespace-nowrap"
              >
                {
                  {
                    Done: <FormattedMessage id="ticket.statuses.done" />,
                    Open: <FormattedMessage id="ticket.statuses.open" />,
                  }[ticket.status]
                }
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-muted-foreground">
              <p className="whitespace-nowrap">
                {ticket.status === TicketStatus.Open ? (
                  <>
                    <FormattedMessage id="ticket.opened_on" />{' '}
                    <time dateTime={ticket.createdAt.toISOString()}>
                      <FormattedDate
                        value={new Date(ticket.createdAt)}
                        year="numeric"
                        month="long"
                        day="numeric"
                      />
                    </time>
                  </>
                ) : (
                  <>
                    <FormattedMessage id="ticket.marked_as_done_on" />{' '}
                    {ticket.statusChangedAt ? (
                      <time dateTime={ticket.statusChangedAt.toISOString()}>
                        <FormattedDate
                          value={new Date(ticket.statusChangedAt)}
                          year="numeric"
                          month="long"
                          day="numeric"
                        />
                      </time>
                    ) : null}
                  </>
                )}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

LinkedTickets.displayName = 'LinkedTickets';
