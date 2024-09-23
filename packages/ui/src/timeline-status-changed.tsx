import type { FC } from 'react';
import { CheckCircle2, CircleDot } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import type { TicketStatusChanged } from '@cs/kyaku/models';
import { TicketStatus } from '@cs/kyaku/models';

import { RelativeTime } from './relative-time';
import type { TimelineItemNarrowed } from './timeline-item';

interface TimelineStatusChangedProps {
  item: TimelineItemNarrowed<TicketStatusChanged>;
}

export const TimelineStatusChanged: FC<TimelineStatusChangedProps> = ({
  item,
}) => {
  return (
    <div className="flex gap-x-4">
      <div className="flex size-6 flex-none items-center justify-center bg-background">
        {item.entry.newStatus === TicketStatus.Done ? (
          <CheckCircle2 className="size-6 text-valid" aria-hidden="true" />
        ) : (
          <CircleDot className="size-6 text-warning" aria-hidden="true" />
        )}
      </div>

      <div className="py-0.5 text-xs leading-5 text-muted-foreground">
        <span className="font-medium text-foreground">
          {item.userCreatedBy?.name}
        </span>{' '}
        {item.entry.oldStatus === TicketStatus.Done &&
        item.entry.newStatus === TicketStatus.Todo ? (
          <FormattedMessage id="ticket.activity.type.ticket_marked_as_open" />
        ) : (
          <FormattedMessage id="ticket.activity.type.ticket_marked_as_done" />
        )}
        <span className="px-1.5">•</span>
        <time dateTime={item.createdAt}>
          <RelativeTime dateTime={new Date(item.createdAt)} />
        </time>
      </div>
    </div>
  );
};
