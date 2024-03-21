'use client';

import { FC } from 'react';

import { Timeline } from '@cs/ui/timeline';

import { useTimeline } from '~/app/_components/tickets/use-timeline';
import { TimelineItem } from '~/app/_components/timeline/timeline-item';

export const TicketTimeline: FC<{ ticketId: string }> = ({ ticketId }) => {
  const timeline = useTimeline(ticketId);

  return (
    <Timeline
      items={timeline.data?.map((timelineEntry) => timelineEntry.id) ?? []}
      renderItem={({ ...props }) => <TimelineItem {...props} />}
      ticketId={ticketId}
    />
  );
};
