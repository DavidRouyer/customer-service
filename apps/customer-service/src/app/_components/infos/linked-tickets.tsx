'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { Badge } from '@cs/ui/badge';

import { TicketStatus, useTicketsQuery } from '~/graphql/generated/client';

interface LinkedTicketsProps {
  ticketId: string;
  customerId?: string;
}

export const LinkedTickets: FC<LinkedTicketsProps> = ({
  ticketId,
  customerId,
}) => {
  const { data: ticketsData } = useTicketsQuery(
    {
      filters: {
        customerIds: [customerId ?? ''],
      },
    },
    {
      enabled: !!customerId,
      select: (data) => data.tickets,
    }
  );

  return (
    <ul className="flex flex-col gap-y-1">
      {ticketsData?.edges
        .filter((ticket) => ticket.node.id !== ticketId)
        .map((ticket) => (
          <li key={ticket.node.id}>
            <Link
              href={`/ticket/${ticket.node.id}`}
              className="block flex-auto rounded-md p-3 ring-1 ring-inset ring-border"
            >
              <div className="flex items-start gap-x-3">
                <p className="text-sm font-semibold leading-6 text-foreground">
                  #{ticket.node.id}
                </p>
                <Badge
                  variant={
                    (
                      {
                        DONE: 'success',
                        OPEN: 'neutral',
                      } as const
                    )[ticket.node.status]
                  }
                  className="mt-0.5 whitespace-nowrap"
                >
                  {
                    {
                      DONE: <FormattedMessage id="ticket.statuses.done" />,
                      OPEN: <FormattedMessage id="ticket.statuses.open" />,
                    }[ticket.node.status]
                  }
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-muted-foreground">
                <p className="whitespace-nowrap">
                  {ticket.node.status === TicketStatus.Open ? (
                    <>
                      <FormattedMessage id="ticket.opened_on" />{' '}
                      <time dateTime={ticket.node.createdAt}>
                        <FormattedDate
                          value={new Date(ticket.node.createdAt)}
                          year="numeric"
                          month="long"
                          day="numeric"
                        />
                      </time>
                    </>
                  ) : (
                    <>
                      <FormattedMessage id="ticket.marked_as_done_on" />{' '}
                      {ticket.node.statusChangedAt ? (
                        <time dateTime={ticket.node.statusChangedAt}>
                          <FormattedDate
                            value={new Date(ticket.node.statusChangedAt)}
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
