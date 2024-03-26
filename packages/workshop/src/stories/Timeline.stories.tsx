import { Timeline } from "@cs/ui/timeline";
import { TimelineItem, TimelineItemType } from "@cs/ui/timeline-item";
import type { Meta } from '@storybook/react';
import { TicketStatus, TicketTimelineEntryType } from '@cs/kyaku/models';

const meta = {
  title: 'Example/Timeline',
  component: Timeline,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Timeline>;

const items: Record<string, TimelineItemType> = 
 {
  '1': {
    id: '1',
    type: TicketTimelineEntryType.StatusChanged,
    createdAt: new Date(),
    customerId: '1',
    entry: {
      newStatus: TicketStatus.Done,
      oldStatus: TicketStatus.Open,
    },
    customerCreatedBy: null,
    userCreatedBy: {
      id: '1',
      name: 'John Doe',
      image: null
    },
  }
 }

export default meta;

export const Test = () => {
  return <Timeline items={Object.keys(items)} renderItem={({itemId}) => <TimelineItem item={items[itemId]} nextItemId={undefined} previousItemId={undefined} />} ticketId="ticket-id" />
}