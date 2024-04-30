import { FC } from 'react';

import { TimelineItem } from '@cs/ui/timeline-item';

import { useTicketQuery } from '~/graphql/generated/client';

export const SmartTimelineItem: FC<{ itemId: string; ticketId: string }> = ({
  itemId,
  ticketId,
}) => {
  const { data: ticketData } = useTicketQuery(
    { id: ticketId },
    { select: (data) => data.ticket }
  );
  const timeline = ticketData?.timelineEntries?.edges;
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
      nextItemId={nextItemId?.node?.id}
      previousItemId={previousItemId?.node?.id}
    />
  );
};
