import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { TicketAssignmentChangedWithData } from '@cs/kyaku/models';

import { RelativeTime } from './relative-time';
import { TimelineItemType } from './timeline-item';

type TimelineAssigmentChangedType = {
  entry: TicketAssignmentChangedWithData;
} & Omit<TimelineItemType, 'entry'>;

type TimelineAssigmentChangedProps = {
  item: TimelineAssigmentChangedType;
};

export const TimelineAssigmentChanged: FC<TimelineAssigmentChangedProps> = ({
  item,
}) => {
  return (
    <div className="flex gap-x-4">
      <div className="flex size-6 flex-none items-center justify-center bg-background">
        <div className="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
      </div>

      <div className="py-0.5 text-xs leading-5 text-muted-foreground">
        <span className="font-medium text-foreground">
          {item.userCreatedBy?.name}
        </span>{' '}
        <>
          {item.entry?.oldAssignedToId === null &&
          item.entry?.newAssignedToId !== null ? (
            item.entry?.newAssignedToId === item.userCreatedBy?.id ? (
              <FormattedMessage id="ticket.activity.type.ticket_assignment.self_assigned" />
            ) : (
              <>
                <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
                <span className="font-medium text-foreground">
                  {item.entry?.newAssignedTo?.name}
                </span>
              </>
            )
          ) : null}
          {item.entry?.oldAssignedToId !== null &&
          item.entry?.newAssignedToId !== null ? (
            <>
              <FormattedMessage id="ticket.activity.type.ticket_assignment.assigned" />{' '}
              <span className="font-medium text-foreground">
                {item.entry?.newAssignedTo?.name}
              </span>{' '}
              <FormattedMessage id="ticket.activity.type.ticket_assignment.and_unassigned" />{' '}
              <span className="font-medium text-foreground">
                {item.entry?.oldAssignedTo?.name}
              </span>
            </>
          ) : null}
          {item.entry?.oldAssignedToId !== null &&
          item.entry?.newAssignedToId === null ? (
            <>
              {item.entry?.oldAssignedToId === item.userCreatedBy?.id ? (
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
        <span className="px-1.5">•</span>
        <time dateTime={item.createdAt.toISOString()}>
          <RelativeTime dateTime={new Date(item.createdAt)} />
        </time>
      </div>
    </div>
  );
};
