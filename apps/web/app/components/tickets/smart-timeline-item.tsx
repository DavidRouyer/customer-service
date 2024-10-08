import type { FC } from 'react';

import { TimelineItem } from '@kyaku/ui/timeline-item';

import { useTimeline } from '~/components/tickets/use-timeline';

export const SmartTimelineItem: FC<{ itemId: string; ticketId: string }> = ({
  itemId,
  ticketId,
}) => {
  const { data: timelineData } = useTimeline(ticketId);
  const timeline = timelineData?.edges;
  const item = timeline?.find((entry) => entry.node.id === itemId);

  if (!timeline) return null;
  if (!item) return null;

  const previousItemId =
    timeline[timeline.findIndex((entry) => entry.node.id === itemId) - 1];
  const nextItemId =
    timeline[timeline.findIndex((entry) => entry.node.id === itemId) + 1];

  return (
    <TimelineItem
      item={item.node}
      nextItemId={nextItemId?.node.id}
      previousItemId={previousItemId?.node.id}
    />
  );
};
