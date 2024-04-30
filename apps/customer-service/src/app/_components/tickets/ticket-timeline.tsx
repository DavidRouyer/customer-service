'use client';

import { FC } from 'react';

import { Timeline } from '@cs/ui/timeline';

import { SmartTimelineItem } from '~/app/_components/tickets/smart-timeline-item';
import { useTicketQuery } from '~/graphql/generated/client';

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
  const { data: ticketData } = useTicketQuery(
    { id: ticketId },
    { select: (data) => data.ticket }
  );

  return (
    <Timeline
      items={
        ticketData?.timelineEntries?.edges?.map(
          (timelineEntry) => timelineEntry.node.id
        ) ?? []
      }
      renderItem={renderItem}
      ticketId={ticketId}
    />
  );
};
