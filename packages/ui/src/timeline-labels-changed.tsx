import { FC } from 'react';
import { Badge } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketLabelsChangedWithData } from '@cs/kyaku/models';

import { RelativeTime } from './relative-time';
import { TimelineItemType } from './timeline-item';

type TimelineLabelsChangedType = {
  entry: TicketLabelsChangedWithData;
} & Omit<TimelineItemType, 'entry'>;

type TimelineLabelsChangedProps = {
  item: TimelineLabelsChangedType;
};

export const TimelineLabelsChanged: FC<TimelineLabelsChangedProps> = ({
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
        {
          <>
            {item.entry?.oldLabelIds?.length === 0 ? (
              <>
                <FormattedMessage id="ticket.activity.type.ticket_label.added" />{' '}
                {item.entry?.newLabels?.map((label) => (
                  <Badge key={label.id}>{label.labelType.name}</Badge>
                ))}
              </>
            ) : null}
            {item.entry?.newLabelIds?.length === 0 ? (
              <>
                <FormattedMessage id="ticket.activity.type.ticket_label.removed" />{' '}
                {item.entry?.oldLabels?.map((label) => (
                  <Badge key={label.id}>{label.labelType.name}</Badge>
                ))}
              </>
            ) : null}
          </>
        }
        <span className="px-1.5">•</span>
        <time dateTime={item.createdAt.toISOString()}>
          <RelativeTime dateTime={new Date(item.createdAt)} />
        </time>
      </div>
    </div>
  );
};
