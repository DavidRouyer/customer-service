import { FC } from 'react';

import { TimelineItem } from '@cs/ui/timeline-item';

import { useTimeline } from '~/app/_components/tickets/use-timeline';

export const SmartTimelineItem: FC<{ itemId: string; ticketId: string }> = ({
  itemId,
  ticketId,
}) => {
  const timeline = useTimeline(ticketId);
  const item = timeline.data?.find((entry) => entry.id === itemId);

  const previousItemId =
    timeline.data?.[
      timeline.data?.findIndex((entry) => entry.id === itemId) - 1
    ];
  const nextItemId =
    timeline.data?.[
      timeline.data?.findIndex((entry) => entry.id === itemId) + 1
    ];

  return (
    <TimelineItem
      item={item}
      nextItemId={nextItemId?.id}
      previousItemId={previousItemId?.id}
    />
  );
};
