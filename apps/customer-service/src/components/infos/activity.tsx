import { FC, ReactNode } from 'react';
import { CheckCircle2, CircleDot } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import {
  TicketAssignmentChangedWithData,
  TicketLabelsChangedWithData,
} from '@cs/api/src/router/ticketTimeline';
import { TicketStatus } from '@cs/lib/tickets';
import {
  TicketChat,
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
  entry: RouterOutputs['ticketTimeline']['byTicketId'][0];
  isLast: boolean;
}> = ({ entry, isLast }) => {
  let activity: ReactNode = null;
  if (entry.type === TicketTimelineEntryType.Chat) {
    activity = (
      <div className="my-2 flex">
        <div className="flex-auto rounded-md bg-accent p-3">
          <div className="flex justify-between gap-x-4">
            <div className="py-0.5 text-xs leading-5 text-muted-foreground">
              <div className="flex items-center gap-x-2">
                <Avatar className="relative h-6 w-6 flex-none text-xs">
                  <AvatarImage
                    src={
                      entry.userCreatedBy?.image ??
                      entry.customerCreatedBy?.avatarUrl ??
                      undefined
                    }
                  />
                  <AvatarFallback>
                    {getInitials(
                      entry.userCreatedBy?.name ??
                        entry.customerCreatedBy?.name ??
                        ''
                    )}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {entry.userCreatedBy?.name ?? entry.customerCreatedBy?.name}
                </span>
              </div>
            </div>
            <time
              dateTime={entry.createdAt.toISOString()}
              className="flex-none py-0.5 text-xs leading-5 text-muted-foreground"
            >
              <RelativeTime dateTime={new Date(entry.createdAt)} />
            </time>
          </div>
          <p className="text-sm leading-6 text-gray-500">
            {(entry.entry as TicketChat)?.text}
          </p>
        </div>
      </div>
    );
  }

  if (entry.type === TicketTimelineEntryType.Note) {
    activity = (
      <div className="my-2 flex">
        <div
          className={cn(
            isLast ? 'h-6' : '-bottom-6',
            'absolute left-0 top-0 flex w-6 justify-center'
          )}
        >
          <div className="w-px bg-border" />
        </div>
        <Avatar className="relative mt-3 h-6 w-6 flex-none text-xs">
          <AvatarImage
            src={
              entry.userCreatedBy?.image ??
              entry.customerCreatedBy?.avatarUrl ??
              undefined
            }
          />
          <AvatarFallback>
            {getInitials(
              entry.userCreatedBy?.name ?? entry.customerCreatedBy?.name ?? ''
            )}
          </AvatarFallback>
        </Avatar>
        <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-muted-foreground">
          <div className="flex justify-between gap-x-4">
            <div className="py-0.5 text-xs leading-5 text-muted-foreground">
              <span className="font-medium text-foreground">
                {entry.userCreatedBy?.name ?? entry.customerCreatedBy?.name}
              </span>{' '}
              <FormattedMessage id="ticket.activity.type.ticket_commented" />
            </div>
            <time
              dateTime={entry.createdAt.toISOString()}
              className="flex-none py-0.5 text-xs leading-5 text-muted-foreground"
            >
              <RelativeTime dateTime={new Date(entry.createdAt)} />
            </time>
          </div>
          <p className="text-sm leading-6 text-gray-500">
            <NodeContent content={(entry.entry as TicketNote)?.text} />
          </p>
        </div>
      </div>
    );
  }

  if (activity === null) {
    activity = (
      <div className="flex gap-x-4">
        <div className="flex h-6 w-6 flex-none items-center justify-center bg-background">
          {entry.type === TicketTimelineEntryType.StatusChanged &&
          (entry.entry as TicketStatusChanged)?.newStatus ===
            TicketStatus.Done ? (
            <CheckCircle2 className="h-6 w-6 text-valid" aria-hidden="true" />
          ) : entry.type === TicketTimelineEntryType.StatusChanged &&
            (entry.entry as TicketStatusChanged)?.newStatus ===
              TicketStatus.Open ? (
            <CircleDot className="h-6 w-6 text-warning" aria-hidden="true" />
          ) : (
            <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
          )}
        </div>

        <div className="py-0.5 text-xs leading-5 text-muted-foreground">
          <span className="font-medium text-foreground">
            {entry.userCreatedBy?.name}
          </span>{' '}
          {
            {
              AssignmentChanged: (
                <>
                  {(entry.entry as TicketAssignmentChangedWithData)
                    ?.oldAssignedToId === null &&
                  (entry.entry as TicketAssignmentChangedWithData)
                    ?.newAssignedToId !== null ? (
                    (entry.entry as TicketAssignmentChangedWithData)
                      ?.newAssignedToId === entry.userCreatedById ? (
                      <FormattedMessage id="ticket.activity.type.ticket_assignment.self_assigned" />
                    ) : (
                      <>
                        <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
                        <span className="font-medium text-foreground">
                          {
                            (entry.entry as TicketAssignmentChangedWithData)
                              ?.newAssignedTo?.name
                          }
                        </span>
                      </>
                    )
                  ) : null}
                  {(entry.entry as TicketAssignmentChangedWithData)
                    ?.oldAssignedToId !== null &&
                  (entry.entry as TicketAssignmentChangedWithData)
                    ?.newAssignedToId !== null ? (
                    <>
                      <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
                      <span className="font-medium text-foreground">
                        {
                          (entry.entry as TicketAssignmentChangedWithData)
                            ?.newAssignedTo?.name
                        }
                      </span>{' '}
                      <FormattedMessage id="ticket.activity.type.ticket_assignment.and_unassigned" />{' '}
                      <span className="font-medium text-foreground">
                        {
                          (entry.entry as TicketAssignmentChangedWithData)
                            ?.oldAssignedTo?.name
                        }
                      </span>
                    </>
                  ) : null}
                  {(entry.entry as TicketAssignmentChangedWithData)
                    ?.oldAssignedToId !== null &&
                  (entry.entry as TicketAssignmentChangedWithData)
                    ?.newAssignedToId === null ? (
                    <>
                      {(entry.entry as TicketAssignmentChangedWithData)
                        ?.oldAssignedToId === entry.userCreatedById ? (
                        <FormattedMessage id="ticket.activity.type.ticket_assignment.self_unassigned" />
                      ) : (
                        <>
                          <FormattedMessage id="ticket.activity.type.ticket_assignment.unassigned" />{' '}
                          <span className="font-medium text-foreground">
                            {
                              (entry.entry as TicketAssignmentChangedWithData)
                                ?.oldAssignedTo?.name
                            }
                          </span>
                        </>
                      )}
                    </>
                  ) : null}
                </>
              ),
              LabelsChanged: (
                <>
                  {(entry.entry as TicketLabelsChangedWithData)?.oldLabelIds
                    ?.length === 0 ? (
                    <>
                      <FormattedMessage id="ticket.activity.type.ticket_label.added" />{' '}
                      {(
                        entry.entry as TicketLabelsChangedWithData
                      )?.newLabels?.map((label) => (
                        <Badge key={label.id}>{label.labelType.name}</Badge>
                      ))}
                    </>
                  ) : null}
                  {(entry.entry as TicketLabelsChangedWithData)?.newLabelIds
                    ?.length === 0 ? (
                    <>
                      <FormattedMessage id="ticket.activity.type.ticket_label.removed" />{' '}
                      {(
                        entry.entry as TicketLabelsChangedWithData
                      )?.oldLabels?.map((label) => (
                        <Badge key={label.id}>{label.labelType.name}</Badge>
                      ))}
                    </>
                  ) : null}
                </>
              ),
              PriorityChanged: (
                <>
                  <FormattedMessage id="ticket.activity.type.ticket_priority.changed" />{' '}
                  <span className="space-x-1">
                    <TicketPriority
                      priority={
                        (entry.entry as TicketPriorityChanged)?.oldPriority
                      }
                    />
                  </span>{' '}
                  <FormattedMessage id="ticket.activity.type.ticket_priority.to" />{' '}
                  <span className="space-x-1">
                    <TicketPriority
                      priority={
                        (entry.entry as TicketPriorityChanged)?.newPriority
                      }
                    />
                  </span>
                </>
              ),
              StatusChanged: (
                <>
                  {(entry.entry as TicketStatusChanged)?.oldStatus ===
                    TicketStatus.Done &&
                  (entry.entry as TicketStatusChanged)?.newStatus ===
                    TicketStatus.Open ? (
                    <FormattedMessage id="ticket.activity.type.ticket_reopened" />
                  ) : (
                    <FormattedMessage id="ticket.activity.type.ticket_resolved" />
                  )}
                </>
              ),
              Chat: null,
              Note: null,
            }[entry.type]
          }
          <span className="px-1.5">•</span>
          <time dateTime={entry.createdAt.toISOString()}>
            <RelativeTime dateTime={new Date(entry.createdAt)} />
          </time>
        </div>
      </div>
    );
  }

  return (
    <>
      {activity}
      <div className="grid grid-cols-[24px_auto] gap-6">
        <div
          className={cn(
            !isLast
              ? 'm-auto h-full w-0 border-l border-muted-foreground bg-gray-200'
              : undefined
          )}
        ></div>
        <div className="mb-6"></div>
      </div>
    </>
  );
};

Activity.displayName = 'ActivityPanel';
