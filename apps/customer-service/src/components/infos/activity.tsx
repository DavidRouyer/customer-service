import { FC } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import {
  TicketAssignmentChangedWithData,
  TicketLabelsChangedWithData,
} from '@cs/api/src/router/ticketTimeline';
import { TicketStatus } from '@cs/lib/tickets';
import {
  TicketNote,
  TicketPriorityChanged,
  TicketStatusChanged,
  TicketTimelineEntryType,
} from '@cs/lib/ticketTimelineEntries';

import { NodeContent } from '~/components/infos/node-content';
import { TicketPriority } from '~/components/tickets/ticket-priority';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { RelativeTime } from '~/components/ui/relative-time';
import { RouterOutputs } from '~/lib/api';
import { getInitials } from '~/lib/string';
import { cn } from '~/lib/utils';

export const Activity: FC<{
  entries: RouterOutputs['ticketTimeline']['byTicketId'];
}> = ({ entries }) => {
  return (
    <ul className="space-y-6">
      {entries?.map((ticketTimelineEntry, ticketTimelineEntryIdx) => (
        <li key={ticketTimelineEntry.id} className="relative flex gap-x-4">
          <div
            className={cn(
              ticketTimelineEntryIdx === entries.length - 1
                ? 'h-6'
                : '-bottom-6',
              'absolute left-0 top-0 flex w-6 justify-center'
            )}
          >
            <div className="w-px bg-border" />
          </div>
          {
            <>
              {ticketTimelineEntry.type === TicketTimelineEntryType.Note ? (
                <>
                  <Avatar className="relative mt-3 h-6 w-6 flex-none text-xs">
                    <AvatarImage
                      src={
                        ticketTimelineEntry.userCreatedBy?.image ?? undefined
                      }
                    />
                    <AvatarFallback>
                      {getInitials(
                        ticketTimelineEntry.userCreatedBy?.name ?? ''
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-muted-foreground">
                    <div className="flex justify-between gap-x-4">
                      <div className="py-0.5 text-xs leading-5 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {ticketTimelineEntry.userCreatedBy?.name}
                        </span>{' '}
                        <FormattedMessage id="ticket.activity.type.ticket_commented" />
                      </div>
                      <time
                        dateTime={ticketTimelineEntry.createdAt.toISOString()}
                        className="flex-none py-0.5 text-xs leading-5 text-muted-foreground"
                      >
                        <RelativeTime
                          dateTime={new Date(ticketTimelineEntry.createdAt)}
                        />
                      </time>
                    </div>
                    <p className="text-sm leading-6 text-gray-500">
                      <NodeContent
                        content={
                          (ticketTimelineEntry.entry as TicketNote)?.text
                        }
                      />
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-background">
                    {ticketTimelineEntry.type ===
                      TicketTimelineEntryType.StatusChanged &&
                    (ticketTimelineEntry.entry as TicketStatusChanged)
                      ?.newStatus === TicketStatus.Done ? (
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
                      {ticketTimelineEntry.userCreatedBy?.name}
                    </span>{' '}
                    {
                      {
                        AssignmentChanged: (
                          <>
                            {(
                              ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                            )?.oldAssignedToId === null &&
                            (
                              ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                            )?.newAssignedToId !== null ? (
                              (
                                ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                              )?.newAssignedToId ===
                              ticketTimelineEntry.userCreatedById ? (
                                <FormattedMessage id="ticket.activity.type.ticket_assignment.self_assigned" />
                              ) : (
                                <>
                                  <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
                                  <span className="font-medium text-foreground">
                                    {
                                      (
                                        ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                                      )?.newAssignedTo?.name
                                    }
                                  </span>
                                </>
                              )
                            ) : null}
                            {(
                              ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                            )?.oldAssignedToId !== null &&
                            (
                              ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                            )?.newAssignedToId !== null ? (
                              <>
                                <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
                                <span className="font-medium text-foreground">
                                  {
                                    (
                                      ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                                    )?.newAssignedTo?.name
                                  }
                                </span>{' '}
                                <FormattedMessage id="ticket.activity.type.ticket_assignment.and_unassigned" />{' '}
                                <span className="font-medium text-foreground">
                                  {
                                    (
                                      ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                                    )?.oldAssignedTo?.name
                                  }
                                </span>
                              </>
                            ) : null}
                            {(
                              ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                            )?.oldAssignedToId !== null &&
                            (
                              ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                            )?.newAssignedToId === null ? (
                              <>
                                {(
                                  ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                                )?.oldAssignedToId ===
                                ticketTimelineEntry.userCreatedById ? (
                                  <FormattedMessage id="ticket.activity.type.ticket_assignment.self_unassigned" />
                                ) : (
                                  <>
                                    <FormattedMessage id="ticket.activity.type.ticket_assignment.unassigned" />{' '}
                                    <span className="font-medium text-foreground">
                                      {
                                        (
                                          ticketTimelineEntry.entry as TicketAssignmentChangedWithData
                                        )?.oldAssignedTo?.name
                                      }
                                    </span>
                                  </>
                                )}
                              </>
                            ) : null}
                          </>
                        ),
                        Chat: <>TODO</>,
                        Created: (
                          <FormattedMessage id="ticket.activity.type.ticket_created" />
                        ),
                        LabelsChanged: (
                          <>
                            {(
                              ticketTimelineEntry.entry as TicketLabelsChangedWithData
                            )?.oldLabelIds?.length === 0 ? (
                              <>
                                <FormattedMessage id="ticket.activity.type.ticket_label.added" />{' '}
                                {(
                                  ticketTimelineEntry.entry as TicketLabelsChangedWithData
                                )?.newLabels?.map((label) => (
                                  <Badge key={label.id}>
                                    {label.labelType.name}
                                  </Badge>
                                ))}
                              </>
                            ) : null}
                            {(
                              ticketTimelineEntry.entry as TicketLabelsChangedWithData
                            )?.newLabelIds?.length === 0 ? (
                              <>
                                <FormattedMessage id="ticket.activity.type.ticket_label.removed" />{' '}
                                {(
                                  ticketTimelineEntry.entry as TicketLabelsChangedWithData
                                )?.oldLabels?.map((label) => (
                                  <Badge key={label.id}>
                                    {label.labelType.name}
                                  </Badge>
                                ))}
                              </>
                            ) : null}
                          </>
                        ),
                        PriorityChanged: (
                          <>
                            <FormattedMessage id="ticket.activity.type.ticket_priority.changed" />
                            <span className="inline-flex flex-nowrap space-x-1">
                              <TicketPriority
                                priority={
                                  (
                                    ticketTimelineEntry.entry as TicketPriorityChanged
                                  )?.oldPriority
                                }
                              />
                            </span>{' '}
                            <FormattedMessage id="ticket.activity.type.ticket_priority.to" />{' '}
                            <span className="inline-flex flex-nowrap space-x-1">
                              <TicketPriority
                                priority={
                                  (
                                    ticketTimelineEntry.entry as TicketPriorityChanged
                                  )?.newPriority
                                }
                              />
                            </span>
                          </>
                        ),
                        StatusChanged: (
                          <>
                            {(ticketTimelineEntry.entry as TicketStatusChanged)
                              ?.oldStatus === TicketStatus.Done &&
                            (ticketTimelineEntry.entry as TicketStatusChanged)
                              ?.oldStatus === TicketStatus.Open ? (
                              <FormattedMessage id="ticket.activity.type.ticket_reopened" />
                            ) : (
                              <FormattedMessage id="ticket.activity.type.ticket_resolved" />
                            )}
                          </>
                        ),
                      }[ticketTimelineEntry.type]
                    }
                    .
                  </p>
                  <time
                    dateTime={ticketTimelineEntry.createdAt.toISOString()}
                    className="flex-none py-0.5 text-xs leading-5 text-muted-foreground"
                  >
                    <RelativeTime
                      dateTime={new Date(ticketTimelineEntry.createdAt)}
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
