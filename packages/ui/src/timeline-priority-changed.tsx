import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { TicketPriorityChanged } from '@cs/kyaku/models';

import { RelativeTime } from './relative-time';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { TimelineItemNarrowed } from './timeline-item';

type TimelinePriorityChangedProps = {
  item: TimelineItemNarrowed<TicketPriorityChanged>;
};

export const TimelinePriorityChanged: FC<TimelinePriorityChangedProps> = ({
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
        <FormattedMessage id="ticket.activity.type.ticket_priority.changed" />{' '}
        <span className="space-x-1">
          <TicketPriorityBadge priority={item.entry?.oldPriority} />
        </span>{' '}
        <FormattedMessage id="ticket.activity.type.ticket_priority.to" />{' '}
        <span className="space-x-1">
          <TicketPriorityBadge priority={item.entry?.newPriority} />
        </span>
        <span className="px-1.5">•</span>
        <time dateTime={item.createdAt}>
          <RelativeTime dateTime={new Date(item.createdAt)} />
        </time>
      </div>
    </div>
  );
};
