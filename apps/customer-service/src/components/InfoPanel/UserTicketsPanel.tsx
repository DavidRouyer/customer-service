import { FC } from 'react';
import { Trans } from 'react-i18next';

import { cn } from '~/lib/utils';

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

const statuses = {
  resolved: 'text-green-700 bg-green-50 ring-green-600/20',
  open: 'text-gray-600 bg-gray-50 ring-gray-500/10',
};

export const UserTicketsPanel: FC = () => {
  return (
    <ul className="flex flex-col gap-y-1">
      {userTickets.map((ticket) => (
        <li key={ticket.id}>
          <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
            <div className="flex items-start gap-x-3">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                #{ticket.id}
              </p>
              <p
                className={cn(
                  statuses[ticket.status],
                  'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                )}
              >
                {ticket.status === 'open' ? (
                  <Trans i18nKey="ticket.statuses.open" />
                ) : (
                  <Trans i18nKey="ticket.statuses.resolved" />
                )}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="whitespace-nowrap">
                {!ticket.resolvedDate ? (
                  <>
                    <Trans i18nKey="ticket.opened_on" />{' '}
                    <time dateTime={ticket.openedDate}>
                      <Trans
                        i18nKey="date"
                        values={{
                          val: new Date(ticket.openedDate),
                          formatParams: {
                            val: {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          },
                        }}
                      />
                    </time>
                  </>
                ) : (
                  <>
                    <Trans i18nKey="ticket.resolved_on" />{' '}
                    <time dateTime={ticket.resolvedDate}>
                      <Trans
                        i18nKey="date"
                        values={{
                          val: new Date(ticket.resolvedDate),
                          formatParams: {
                            val: {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          },
                        }}
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
