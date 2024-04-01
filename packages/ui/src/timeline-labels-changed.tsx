import { FC } from 'react';
import { Tag } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketLabelsChangedWithData } from '@cs/kyaku/models';

import { Icon, IconType } from './icon';
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
        {(item.entry?.oldLabels?.length ?? 0) > 0 ? (
          <>
            <FormattedMessage id="ticket.activity.type.ticket_label.removed" />{' '}
            {item.entry?.oldLabels?.map((label) => (
              <span key={label.id} className="space-x-1">
                <Icon
                  fallback={<Tag className="inline-flex size-4" />}
                  name={label.labelType.icon as IconType}
                  className="inline-flex size-4"
                />
                <span>{label.labelType.name}</span>
              </span>
            ))}
          </>
        ) : null}
        {(item.entry?.newLabels?.length ?? 0) > 0 ? (
          <>
            <FormattedMessage id="ticket.activity.type.ticket_label.added" />{' '}
            {item.entry?.newLabels?.map((label) => (
              <span key={label.id} className="space-x-1">
                <Icon
                  fallback={<Tag className="inline-flex size-4" />}
                  name={label.labelType.icon as IconType}
                  className="inline-flex size-4"
                />
                <span>{label.labelType.name}</span>
              </span>
            ))}
          </>
        ) : null}
        <span className="px-1.5">•</span>
        <time dateTime={item.createdAt.toISOString()}>
          <RelativeTime dateTime={new Date(item.createdAt)} />
        </time>
      </div>
    </div>
  );
};
