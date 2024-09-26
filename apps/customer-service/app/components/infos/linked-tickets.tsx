'use client';

import { Link, useParams } from '@tanstack/react-router';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { Badge } from '@kyaku/ui/badge';

import {
  TicketStatus,
  useSuspenseTicketQuery,
  useTicketsQuery,
} from '~/graphql/generated/client';

export const LinkedTickets = () => {
  const { ticketId } = useParams({ from: '/_authed/ticket/_layout/$ticketId' });
  const { data: ticketData } = useSuspenseTicketQuery(
    {
      ticketId,
    },
    {
      select: (data) => data.ticket,
    }
  );
  const { data: ticketsData } = useTicketsQuery(
    {
      filters: {
        customerIds: [ticketData?.customer.id ?? ''],
      },
    },
    {
      enabled: !!ticketData?.customer.id,
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
              to="/ticket/$ticketId"
              params={{ ticketId: ticket.node.id }}
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
                        SNOOZED: 'warning',
                        TODO: 'neutral',
                      } as const
                    )[ticket.node.status]
                  }
                  className="mt-0.5 whitespace-nowrap"
                >
                  {
                    {
                      DONE: <FormattedMessage id="ticket.statuses.done" />,
                      SNOOZED: (
                        <FormattedMessage id="ticket.statuses.snoozed" />
                      ),
                      TODO: <FormattedMessage id="ticket.statuses.todo" />,
                    }[ticket.node.status]
                  }
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-muted-foreground">
                <p className="whitespace-nowrap">
                  {ticket.node.status === TicketStatus.Todo ? (
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
