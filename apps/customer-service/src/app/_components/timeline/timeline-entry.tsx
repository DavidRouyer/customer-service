import { FC, ReactNode } from 'react';
import { CheckCircle2, CircleDot, EyeOff } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { RouterOutputs } from '@cs/api';
import {
  TicketAssignmentChangedWithData,
  TicketChat,
  TicketNote,
  TicketPriorityChanged,
  TicketStatus,
  TicketStatusChanged,
  TicketTimelineEntryType,
} from '@cs/kyaku/models';
import { cn } from '@cs/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@cs/ui/avatar';
import { Badge } from '@cs/ui/badge';

import { NodeContent } from '~/app/_components/infos/node-content';
import { TicketPriority } from '~/app/_components/tickets/ticket-priority';
import { RelativeTime } from '~/app/_components/ui/relative-time/relative-time';
import { getInitials } from '~/app/lib/string';

export const TimelineEntry: FC<{
  customer?: RouterOutputs['ticket']['byId']['customer'];
  entry: RouterOutputs['ticketTimeline']['byTicketId'][0];
  isLast: boolean;
}> = ({ customer, entry, isLast }) => {
  let activity: ReactNode = null;
  if (entry.type === TicketTimelineEntryType.Chat) {
    activity = (
      <div className="my-2 flex">
        <div className="flex-auto rounded-md bg-accent p-4">
          <div className="grid grid-cols-[24px_auto] gap-x-3">
            <Avatar className="relative size-6 flex-none text-xs">
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
            <div className="flex items-center">
              <span className="text-sm text-foreground">
                {entry.userCreatedBy?.name ?? entry.customerCreatedBy?.name}
              </span>
              <span className="mx-1.5 size-[3px] rounded-full bg-gray-500"></span>
              <time
                dateTime={entry.createdAt.toISOString()}
                className="text-xs text-muted-foreground"
              >
                <RelativeTime dateTime={new Date(entry.createdAt)} />
              </time>
            </div>
          </div>

          <div className="grid grid-cols-[24px_auto] gap-x-3">
            <div></div>
            <div className="mt-3 border-t border-muted-foreground pt-3">
              <div className="whitespace-pre-line text-sm leading-6 ">
                {(entry.entry as TicketChat)?.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (entry.type === TicketTimelineEntryType.Note) {
    activity = (
      <div className="my-2 flex">
        <div className="flex-auto rounded-md bg-warning/30 p-4">
          <div className="grid grid-cols-[24px_auto] gap-x-3">
            <Avatar className="relative size-6 flex-none text-xs">
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
            <div className="flex items-center">
              <span className="text-sm text-foreground">
                {entry.userCreatedBy?.name ?? entry.customerCreatedBy?.name}
              </span>
              <span className="mx-1.5 size-[3px] rounded-full bg-gray-500"></span>
              <time
                dateTime={entry.createdAt.toISOString()}
                className="text-xs text-muted-foreground"
              >
                <RelativeTime dateTime={new Date(entry.createdAt)} />
              </time>
            </div>
          </div>
          <div className="grid grid-cols-[24px_auto] gap-x-3">
            <div></div>
            <div className="mt-3 border-t border-muted-foreground pt-3">
              <div className="whitespace-pre-line text-sm leading-6">
                <NodeContent
                  content={(entry.entry as TicketNote)?.rawContent}
                />
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500">
                <EyeOff className="size-3" />{' '}
                <FormattedMessage id="ticket.not_visible" /> {customer?.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activity === null) {
    activity = (
      <div className="flex gap-x-4">
        <div className="flex size-6 flex-none items-center justify-center bg-background">
          {entry.type === TicketTimelineEntryType.StatusChanged &&
          (entry.entry as TicketStatusChanged)?.newStatus ===
            TicketStatus.Done ? (
            <CheckCircle2 className="size-6 text-valid" aria-hidden="true" />
          ) : entry.type === TicketTimelineEntryType.StatusChanged &&
            (entry.entry as TicketStatusChanged)?.newStatus ===
              TicketStatus.Open ? (
            <CircleDot className="size-6 text-warning" aria-hidden="true" />
          ) : (
            <div className="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
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
                    <FormattedMessage id="ticket.activity.type.ticket_marked_as_open" />
                  ) : (
                    <FormattedMessage id="ticket.activity.type.ticket_marked_as_done" />
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

TimelineEntry.displayName = 'ActivityPanel';
