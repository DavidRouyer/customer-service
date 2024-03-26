import { FC } from 'react';

import { TimelineItem } from '@cs/ui/timeline-item';

import { useTimeline } from '~/app/_components/tickets/use-timeline';

export const SmartTimelineItem: FC<{ itemId: string; ticketId: string }> = ({
  itemId,
  ticketId,
}) => {
  const timeline = useTimeline(ticketId);
  const item = timeline.data?.find((entry) => entry.id === itemId);

  return (
    <TimelineItem
      item={item}
      nextItemId={undefined}
      previousItemId={undefined}
    />
  );
};
