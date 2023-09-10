'use client';

import { FC } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import { Badge } from '~/components/ui/badge';

type UserTicket = {
  id: number;
  status: 'open' | 'resolved';
  openedDate: string;
  resolvedDate?: string;
};

const userTickets: UserTicket[] = [
  {
    id: 8,
    status: 'open',
    openedDate: '2023-03-18T12:56',
  },
  {
    id: 5,
    status: 'resolved',
    openedDate: '2023-01-12T19:56',
    resolvedDate: '2023-01-23T15:56',
  },
];

export const UserTicketsPanel: FC = () => {
  return (
    <ul className="flex flex-col gap-y-1">
      {userTickets.map((ticket) => (
        <li key={ticket.id}>
          <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-border">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-foreground">
                #{ticket.id}
              </p>
              <Badge
                variant={
                  (
                    {
                      resolved: 'success',
                      open: 'neutral',
                    } as const
                  )[ticket.status]
                }
                className="mt-0.5 whitespace-nowrap"
              >
                {
                  {
                    resolved: (
                      <FormattedMessage id="ticket.statuses.resolved" />
                    ),
                    open: <FormattedMessage id="ticket.statuses.open" />,
                  }[ticket.status]
                }
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-muted-foreground">
              <p className="whitespace-nowrap">
                {!ticket.resolvedDate ? (
                  <>
                    <FormattedMessage id="ticket.opened_on" />{' '}
                    <time dateTime={ticket.openedDate}>
                      <FormattedDate
                        value={new Date(ticket.openedDate)}
                        year="numeric"
                        month="long"
                        day="numeric"
                      />
                    </time>
                  </>
                ) : (
                  <>
                    <FormattedMessage id="ticket.resolved_on" />{' '}
                    <time dateTime={ticket.resolvedDate}>
                      <FormattedDate
                        value={new Date(new Date(ticket.resolvedDate))}
                        year="numeric"
                        month="long"
                        day="numeric"
                      />
                    </time>
                  </>
                )}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

UserTicketsPanel.displayName = 'UserTicketsPanel';
