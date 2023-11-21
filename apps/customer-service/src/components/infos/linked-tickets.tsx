'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { Badge } from '~/components/ui/badge';
import { api } from '~/lib/api';

type LinkedTicketsProps = {
  ticketId: string;
  contactId?: string;
};

export const LinkedTickets: FC<LinkedTicketsProps> = ({
  ticketId,
  contactId,
}) => {
  const searchParams = useSearchParams();

  const { data: ticketsData } = api.ticket.byContactId.useQuery(
    {
      contactId: contactId ?? '',
      excludeId: ticketId,
    },
    {
      enabled: !!contactId,
    }
  );

  return (
    <ul className="flex flex-col gap-y-1">
      {ticketsData?.map((ticket) => (
        <li key={ticket.id}>
          <Link
            href={`/tickets/${ticket.id}?${searchParams.toString()}`}
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
                      Resolved: 'success',
                      Open: 'neutral',
                    } as const
                  )[ticket.status]
                }
                className="mt-0.5 whitespace-nowrap"
              >
                {
                  {
                    Resolved: (
                      <FormattedMessage id="ticket.statuses.resolved" />
                    ),
                    Open: <FormattedMessage id="ticket.statuses.open" />,
                  }[ticket.status]
                }
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-muted-foreground">
              <p className="whitespace-nowrap">
                {!ticket.resolvedAt ? (
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
                    <FormattedMessage id="ticket.resolved_on" />{' '}
                    <time dateTime={ticket.resolvedAt.toISOString()}>
                      <FormattedDate
                        value={new Date(ticket.resolvedAt)}
                        year="numeric"
                        month="long"
                        day="numeric"
                      />
                    </time>
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

LinkedTickets.displayName = 'UserTicketsPanel';
