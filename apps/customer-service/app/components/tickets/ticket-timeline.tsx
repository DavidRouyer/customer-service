'use client';

import type { FC } from 'react';

import { Timeline } from '@kyaku/ui/timeline';

import { SmartTimelineItem } from '~/components/tickets/smart-timeline-item';
import { useTimeline } from '~/components/tickets/use-timeline';

const renderItem = ({
  itemId,
  ticketId,
}: {
  itemId: string;
  nextItemId: string | undefined;
  previousItemId: string | undefined;
  ticketId: string;
}) => <SmartTimelineItem itemId={itemId} ticketId={ticketId} />;

export const TicketTimeline: FC<{ ticketId: string }> = ({ ticketId }) => {
  const { data: timelineData } = useTimeline(ticketId);

  return (
    <Timeline
      items={
        timelineData?.edges.map((timelineEntry) => timelineEntry.node.id) ?? []
      }
      renderItem={renderItem}
      ticketId={ticketId}
    />
  );
};
