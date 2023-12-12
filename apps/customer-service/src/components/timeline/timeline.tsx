'use client';

import { FC, Fragment } from 'react';

import { ScrollableMessageList } from '~/components/scroll/scrollable-message-list';
import { TimelineEntry } from '~/components/timeline/timeline-entry';
import { RelativeDate } from '~/components/ui/relative-date';
import { api, RouterOutputs } from '~/lib/api';

const getTimelineByDay = (
  messages: RouterOutputs['ticketTimeline']['byTicketId']
) => {
  return messages?.reduce<Record<string, RouterOutputs['ticket']['timeline']>>(
    (acc, message) => {
      const date = new Date(message.createdAt);
      const dateAsString = date.toISOString().substring(0, 10);

      if (acc[dateAsString]) {
        acc = {
          ...acc,
          [dateAsString]: [...(acc[dateAsString] ?? []), message],
        };
      } else {
        acc = {
          ...acc,
          [dateAsString]: [message],
        };
      }
      return acc;
    },
    {}
  );
};

export const Timeline: FC<{ ticketId: string }> = ({ ticketId }) => {
  const { data: timelineData } = api.ticketTimeline.byTicketId.useQuery(
    {
      ticketId: ticketId,
    },
    {
      select: getTimelineByDay,
    }
  );

  return (
    <ScrollableMessageList className="relative h-full w-full overflow-hidden py-3">
      {Object.entries(timelineData ?? {}).map(([date, entries]) => (
        <Fragment key={date}>
          <div className="mb-6 flex text-sm">
            <RelativeDate dateTime={new Date(date)} />
          </div>

          {entries?.map((ticketTimelineEntry, ticketTimelineEntryIdx) => (
            <TimelineEntry
              key={ticketTimelineEntry.id}
              entry={ticketTimelineEntry}
              isLast={ticketTimelineEntryIdx === entries.length - 1}
            />
          ))}
        </Fragment>
      ))}
    </ScrollableMessageList>
  );
};
