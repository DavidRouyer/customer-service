import { FC } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import {
  TicketAssignmentAddedWithData,
  TicketAssignmentChangedWithData,
  TicketAssignmentRemovedWithData,
} from '@cs/api/src/router/ticketActivity';
import {
  TicketActivityType,
  TicketCommented,
} from '@cs/database/schema/ticketActivity';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { RelativeTime } from '~/components/ui/relative-time';
import { api } from '~/lib/api';
import { getInitials } from '~/lib/string';
import { cn } from '~/lib/utils';

export const Activity: FC<{
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
              ticketActivityIdx === ticketActivitiesData.length - 1
                ? 'h-6'
                : '-bottom-6',
              'absolute left-0 top-0 flex w-6 justify-center'
            )}
          >
            <div className="w-px bg-border" />
          </div>
          {
            <>
              {ticketActivity.type === TicketActivityType.Commented ? (
                <>
                  <Avatar className="relative mt-3 h-6 w-6 flex-none text-xs">
                    <AvatarImage
                      src={ticketActivity.author.avatarUrl ?? undefined}
                    />
                    <AvatarFallback>
                      {getInitials(ticketActivity.author.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-muted-foreground">
                    <div className="flex justify-between gap-x-4">
                      <div className="py-0.5 text-xs leading-5 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {ticketActivity.author.name}
                        </span>{' '}
                        <FormattedMessage id="ticket.activity.type.ticket_commented" />
                      </div>
                      <time
                        dateTime={ticketActivity.createdAt.toISOString()}
                        className="flex-none py-0.5 text-xs leading-5 text-muted-foreground"
                      >
                        <RelativeTime
                          dateTime={new Date(ticketActivity.createdAt)}
                        />
                      </time>
                    </div>
                    <p className="text-sm leading-6 text-gray-500">
                      {(ticketActivity.extraInfo as TicketCommented)?.comment}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-background">
                    {TicketActivityType.Resolved ? (
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
                        Created: (
                          <FormattedMessage id="ticket.activity.type.ticket_created" />
                        ),
                        Reopened: (
                          <FormattedMessage id="ticket.activity.type.ticket_reopened" />
                        ),
                        Resolved: (
                          <FormattedMessage id="ticket.activity.type.ticket_resolved" />
                        ),
                      }[ticketActivity.type]
                    }
                    .
                  </p>
                  <time
                    dateTime={ticketActivity.createdAt.toISOString()}
                    className="flex-none py-0.5 text-xs leading-5 text-muted-foreground"
                  >
                    <RelativeTime
                      dateTime={new Date(ticketActivity.createdAt)}
                    />
                  </time>
                </>
              )}
            </>
          }
        </li>
      ))}
    </ul>
  );
};

Activity.displayName = 'ActivityPanel';
