'use client';

import { FC, Fragment } from 'react';

import { RouterOutputs } from '@cs/api';

import { ScrollableMessageList } from '~/app/_components/scroll/scrollable-message-list';
import { TimelineEntry } from '~/app/_components/timeline/timeline-entry';
import { RelativeDate } from '~/app/_components/ui/relative-date/relative-date';
import { api } from '~/trpc/react';

export type TimelineByDay = Record<
  string,
  RouterOutputs['ticketTimeline']['byTicketId']
>;

const getTimelineByDay = (
  messages: RouterOutputs['ticketTimeline']['byTicketId']
) => {
  return messages?.reduce<
    Record<string, RouterOutputs['ticketTimeline']['byTicketId']>
  >((acc, message) => {
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
  }, {});
};

export const Timeline: FC<{ ticketId: string }> = ({ ticketId }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({
    id: ticketId,
  });
  const { data: timelineData } = api.ticketTimeline.byTicketId.useQuery(
    {
      ticketId: ticketId,
    },
    {
      select: getTimelineByDay,
    }
  );

  return (
    <ScrollableMessageList className="relative size-full overflow-hidden py-3">
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
              customer={ticketData?.customer}
            />
          ))}
        </Fragment>
      ))}
    </ScrollableMessageList>
  );
};
