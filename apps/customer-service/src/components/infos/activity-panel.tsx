import { FC } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import {
  TicketAssignmentAddedWithData,
  TicketAssignmentChangedWithData,
  TicketAssignmentRemovedWithData,
} from '@cs/api/src/router/ticketActivity';
import { TicketActivityType } from '@cs/database/schema/ticketActivity';

import { RelativeTime } from '~/components/ui/relative-time';
import { api } from '~/utils/api';
import { cn } from '~/utils/utils';

const activity = [
  {
    id: 1,
    type: 'created',
    author: { name: 'Leslie Alexander' },
    createdAt: '2023-01-23T10:32',
  },
  {
    id: 2,
    type: 'assigned',
    author: { name: 'Tom Cook' },
    createdAt: '2023-01-23T11:03',
  },
  {
    id: 3,
    type: 'commented',
    author: {
      name: 'Sophie Radcliff',
      avatarUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    comment: 'Called client, they are not happy with the product.',
    createdAt: '2023-01-23T15:56',
  },
  {
    id: 5,
    type: 'resolved',
    author: { name: 'Tom Cook' },
    createdAt: '2023-01-24T09:20',
  },
];

export const ActivityPanel: FC<{
  ticketId: number;
}> = ({ ticketId }) => {
  const { data: ticketActivitiesData } = api.ticketActivity.byTicketId.useQuery(
    {
      ticketId,
    }
  );
  return (
    <ul className="space-y-6">
      {ticketActivitiesData?.map((ticketActivity, ticketActivityIdx) => (
        <li key={ticketActivity.id} className="relative flex gap-x-4">
          <div
            className={cn(
              ticketActivityIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
              'absolute left-0 top-0 flex w-6 justify-center'
            )}
          >
            <div className="w-px bg-border" />
          </div>
          {
            <>
              <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-background">
                {ticketActivity.type === TicketActivityType.Resolved ? (
                  <CheckCircle2
                    className="h-6 w-6 text-valid"
                    aria-hidden="true"
                  />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                )}
              </div>
              <p className="flex-auto py-0.5 text-xs leading-5 text-muted-foreground">
                <span className="font-medium text-foreground">
                  {ticketActivity.author.name}
                </span>{' '}
                {
                  {
                    Created: (
                      <FormattedMessage id="ticket.activity.type.ticket_created" />
                    ),
                    Reopened: (
                      <FormattedMessage id="ticket.activity.type.ticket_reopened" />
                    ),
                    Resolved: (
                      <FormattedMessage id="ticket.activity.type.ticket_resolved" />
                    ),
                    AssignmentAdded: (
                      <>
                        {(
                          ticketActivity.extraInfo as TicketAssignmentAddedWithData
                        )?.newAssignedToId === ticketActivity.authorId ? (
                          <FormattedMessage id="ticket.activity.type.ticket_assignment.self_assigned" />
                        ) : (
                          <>
                            <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
                            <span className="font-medium text-foreground">
                              {
                                (
                                  ticketActivity.extraInfo as TicketAssignmentAddedWithData
                                )?.newAssignedTo?.name
                              }
                            </span>
                          </>
                        )}
                      </>
                    ),
                    AssignmentChanged: (
                      <>
                        <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
                        <span className="font-medium text-foreground">
                          {
                            (
                              ticketActivity.extraInfo as TicketAssignmentChangedWithData
                            )?.newAssignedTo?.name
                          }
                        </span>{' '}
                        <FormattedMessage id="ticket.activity.type.ticket_assignment.and_unassigned" />{' '}
                        <span className="font-medium text-foreground">
                          {
                            (
                              ticketActivity.extraInfo as TicketAssignmentChangedWithData
                            )?.oldAssignedTo?.name
                          }
                        </span>
                      </>
                    ),
                    AssignmentRemoved: (
                      <>
                        {(
                          ticketActivity.extraInfo as TicketAssignmentRemovedWithData
                        )?.oldAssignedToId === ticketActivity.authorId ? (
                          <FormattedMessage id="ticket.activity.type.ticket_assignment.self_unassigned" />
                        ) : (
                          <>
                            <FormattedMessage id="ticket.activity.type.ticket_assignment.unassigned" />{' '}
                            <span className="font-medium text-foreground">
                              {
                                (
                                  ticketActivity.extraInfo as TicketAssignmentRemovedWithData
                                )?.oldAssignedTo?.name
                              }
                            </span>
                          </>
                        )}
                      </>
                    ),
                  }[ticketActivity.type]
                }
                .
              </p>
              <time
                dateTime={ticketActivity.createdAt.toISOString()}
                className="flex-none py-0.5 text-xs leading-5 text-muted-foreground"
              >
                <RelativeTime dateTime={new Date(ticketActivity.createdAt)} />
              </time>
            </>
          }
        </li>
      ))}
    </ul>
  );
};

ActivityPanel.displayName = 'ActivityPanel';
