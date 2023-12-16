'use client';

import { FC } from 'react';

import { Timeline } from '~/components/timeline/timeline';
import { TimelineItem } from '~/components/timeline/timeline-item';
import { RelativeDate } from '~/components/ui/relative-date';
import { api, RouterOutputs } from '~/lib/api';

export type TimelineByDay = Record<
  string,
  RouterOutputs['ticketTimeline']['byTicketId']
>;

const getTimelineByDay = (
  messages: RouterOutputs['ticketTimeline']['byTicketId']
) => {
  return messages?.reduce<
    Record<string, RouterOutputs['ticketTimeline']['byTicketId'][0]>
  >((acc, message) => {
    acc = {
      ...acc,
      [message.id]: message,
    };
    return acc;
  }, {});
};

export const TicketTimeline: FC<{ ticketId: string }> = ({ ticketId }) => {
  const { data: ticketData, isLoading } = api.ticket.byId.useQuery({
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

  const renderItem = ({
    messageId,
    containerElementRef,
    containerWidthBreakpoint,
  }: {
    messageId: string;
    containerElementRef: React.RefObject<HTMLElement>;
    containerWidthBreakpoint: string;
  }) => (
    <TimelineItem
      containerElementRef={containerElementRef}
      containerWidthBreakpoint={containerWidthBreakpoint}
      ticketId={ticketId}
      item={timelineData?.[messageId]!}
    />
  );

  return (
    <Timeline
      haveNewest={false}
      haveOldest={false}
      items={Object.keys(timelineData ?? {})}
      loadNewerMessages={() => {
        console.log('loadNewerMessages');
      }}
      loadOlderMessages={() => {
        console.log('loadOlderMessages');
      }}
      messageLoadingState={isLoading}
      setIsNearBottom={(ticketId, isNearBottom) => {
        console.log('setIsNearBottom', ticketId, isNearBottom);
      }}
      renderItem={renderItem}
      ticketId={ticketId}
    />
  );
};
