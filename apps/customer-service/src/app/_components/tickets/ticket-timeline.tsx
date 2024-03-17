'use client';

import { FC } from 'react';

import { useTimeline } from '~/app/_components/tickets/use-timeline';
import { Timeline } from '~/app/_components/timeline/timeline';

export const TicketTimeline: FC<{ ticketId: string }> = ({ ticketId }) => {
  const timeline = useTimeline(ticketId);

  return (
    <Timeline
      items={timeline.data?.map((timelineEntry) => timelineEntry.id) ?? []}
      ticketId={ticketId}
    />
  );
};
