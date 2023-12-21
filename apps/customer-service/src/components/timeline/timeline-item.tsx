import { FC, ReactNode, RefObject } from 'react';
import { CheckCircle2, CircleDot, EyeOff } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage, Badge, cn } from '@cs/ui';

import { NodeContent } from '~/components/infos/node-content';
import { TicketPriority } from '~/components/tickets/ticket-priority';
import { RelativeTime } from '~/components/ui/relative-time/relative-time';
import { RouterOutputs } from '~/lib/api';
import { getInitials } from '~/lib/string';

export const TimelineItem: FC<{
  containerElementRef: RefObject<HTMLElement>;
  containerWidthBreakpoint: string;
  ticketId: string;
  customer?: RouterOutputs['ticket']['byId']['customer'];
  item: RouterOutputs['ticketTimeline']['byTicketId'][0];
  previousEntryId?: string;
  nextEntryId?: string;
}> = ({ customer, item }) => {
  let activity: ReactNode = null;
  if (item.type === TicketTimelineEntryType.Chat) {
    activity = (
      <div className="my-2 flex">
        <div className="flex-auto rounded-md bg-accent p-4">
          <div className="grid grid-cols-[24px_auto] gap-x-3">
            <Avatar className="relative h-6 w-6 flex-none text-xs">
              <AvatarImage
                src={
                  item.userCreatedBy?.image ??
                  item.customerCreatedBy?.avatarUrl ??
                  undefined
                }
              />
              <AvatarFallback>
                {getInitials(
                  item.userCreatedBy?.name ?? item.customerCreatedBy?.name ?? ''
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <span className="text-sm text-foreground">
                {item.userCreatedBy?.name ?? item.customerCreatedBy?.name}
              </span>
              <span className="mx-1.5 h-[3px] w-[3px] rounded-full bg-gray-500"></span>
              <time
                dateTime={item.createdAt.toISOString()}
                className="text-xs text-muted-foreground"
              >
                <RelativeTime dateTime={new Date(item.createdAt)} />
              </time>
            </div>
          </div>

          <div className="grid grid-cols-[24px_auto] gap-x-3">
            <div></div>
            <div className="mt-3 border-t border-muted-foreground pt-3">
              <div className="whitespace-pre-line text-sm leading-6 ">
                {(item.entry as TicketChat)?.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === TicketTimelineEntryType.Note) {
    activity = (
      <div className="my-2 flex">
        <div className="flex-auto rounded-md bg-warning/30 p-4">
          <div className="grid grid-cols-[24px_auto] gap-x-3">
            <Avatar className="relative h-6 w-6 flex-none text-xs">
              <AvatarImage
                src={
                  item.userCreatedBy?.image ??
                  item.customerCreatedBy?.avatarUrl ??
                  undefined
                }
              />
              <AvatarFallback>
                {getInitials(
                  item.userCreatedBy?.name ?? item.customerCreatedBy?.name ?? ''
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center">
              <span className="text-sm text-foreground">
                {item.userCreatedBy?.name ?? item.customerCreatedBy?.name}
              </span>
              <span className="mx-1.5 h-[3px] w-[3px] rounded-full bg-gray-500"></span>
              <time
                dateTime={item.createdAt.toISOString()}
                className="text-xs text-muted-foreground"
              >
                <RelativeTime dateTime={new Date(item.createdAt)} />
              </time>
            </div>
          </div>
          <div className="grid grid-cols-[24px_auto] gap-x-3">
            <div></div>
            <div className="mt-3 border-t border-muted-foreground pt-3">
              <div className="whitespace-pre-line text-sm leading-6">
                <NodeContent content={(item.entry as TicketNote)?.rawContent} />
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500">
                <EyeOff className="h-3 w-3" />{' '}
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
        <div className="flex h-6 w-6 flex-none items-center justify-center bg-background">
          {item.type === TicketTimelineEntryType.StatusChanged &&
          (item.entry as TicketStatusChanged)?.newStatus ===
            TicketStatus.Done ? (
            <CheckCircle2 className="h-6 w-6 text-valid" aria-hidden="true" />
          ) : item.type === TicketTimelineEntryType.StatusChanged &&
            (item.entry as TicketStatusChanged)?.newStatus ===
              TicketStatus.Open ? (
            <CircleDot className="h-6 w-6 text-warning" aria-hidden="true" />
          ) : (
            <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
          )}
        </div>

        <div className="py-0.5 text-xs leading-5 text-muted-foreground">
          <span className="font-medium text-foreground">
            {item.userCreatedBy?.name}
          </span>{' '}
          {
            {
              AssignmentChanged: (
                <>
                  {(item.entry as TicketAssignmentChangedWithData)
                    ?.oldAssignedToId === null &&
                  (item.entry as TicketAssignmentChangedWithData)
                    ?.newAssignedToId !== null ? (
                    (item.entry as TicketAssignmentChangedWithData)
                      ?.newAssignedToId === item.userCreatedById ? (
                      <FormattedMessage id="ticket.activity.type.ticket_assignment.self_assigned" />
                    ) : (
                      <>
                        <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
                        <span className="font-medium text-foreground">
                          {
                            (item.entry as TicketAssignmentChangedWithData)
                              ?.newAssignedTo?.name
                          }
                        </span>
                      </>
                    )
                  ) : null}
                  {(item.entry as TicketAssignmentChangedWithData)
                    ?.oldAssignedToId !== null &&
                  (item.entry as TicketAssignmentChangedWithData)
                    ?.newAssignedToId !== null ? (
                    <>
                      <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
                      <span className="font-medium text-foreground">
                        {
                          (item.entry as TicketAssignmentChangedWithData)
                            ?.newAssignedTo?.name
                        }
                      </span>{' '}
                      <FormattedMessage id="ticket.activity.type.ticket_assignment.and_unassigned" />{' '}
                      <span className="font-medium text-foreground">
                        {
                          (item.entry as TicketAssignmentChangedWithData)
                            ?.oldAssignedTo?.name
                        }
                      </span>
                    </>
                  ) : null}
                  {(item.entry as TicketAssignmentChangedWithData)
                    ?.oldAssignedToId !== null &&
                  (item.entry as TicketAssignmentChangedWithData)
                    ?.newAssignedToId === null ? (
                    <>
                      {(item.entry as TicketAssignmentChangedWithData)
                        ?.oldAssignedToId === item.userCreatedById ? (
                        <FormattedMessage id="ticket.activity.type.ticket_assignment.self_unassigned" />
                      ) : (
                        <>
                          <FormattedMessage id="ticket.activity.type.ticket_assignment.unassigned" />{' '}
                          <span className="font-medium text-foreground">
                            {
                              (item.entry as TicketAssignmentChangedWithData)
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
                  {(item.entry as TicketLabelsChangedWithData)?.oldLabelIds
                    ?.length === 0 ? (
                    <>
                      <FormattedMessage id="ticket.activity.type.ticket_label.added" />{' '}
                      {(
                        item.entry as TicketLabelsChangedWithData
                      )?.newLabels?.map((label) => (
                        <Badge key={label.id}>{label.labelType.name}</Badge>
                      ))}
                    </>
                  ) : null}
                  {(item.entry as TicketLabelsChangedWithData)?.newLabelIds
                    ?.length === 0 ? (
                    <>
                      <FormattedMessage id="ticket.activity.type.ticket_label.removed" />{' '}
                      {(
                        item.entry as TicketLabelsChangedWithData
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
                        (item.entry as TicketPriorityChanged)?.oldPriority
                      }
                    />
                  </span>{' '}
                  <FormattedMessage id="ticket.activity.type.ticket_priority.to" />{' '}
                  <span className="space-x-1">
                    <TicketPriority
                      priority={
                        (item.entry as TicketPriorityChanged)?.newPriority
                      }
                    />
                  </span>
                </>
              ),
              StatusChanged: (
                <>
                  {(item.entry as TicketStatusChanged)?.oldStatus ===
                    TicketStatus.Done &&
                  (item.entry as TicketStatusChanged)?.newStatus ===
                    TicketStatus.Open ? (
                    <FormattedMessage id="ticket.activity.type.ticket_marked_as_open" />
                  ) : (
                    <FormattedMessage id="ticket.activity.type.ticket_marked_as_done" />
                  )}
                </>
              ),
              Chat: null,
              Note: null,
            }[item.type]
          }
          <span className="px-1.5">•</span>
          <time dateTime={item.createdAt.toISOString()}>
            <RelativeTime dateTime={new Date(item.createdAt)} />
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
            'm-auto h-full w-0 border-l border-muted-foreground bg-gray-200'
          )}
        ></div>
        <div className="mb-6"></div>
      </div>
    </>
  );
};

TimelineItem.displayName = 'TimelineItem';
