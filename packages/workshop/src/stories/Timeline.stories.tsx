import { Timeline } from "@cs/ui/timeline";
import { TimelineItem, TimelineItemType } from "@cs/ui/timeline-item";
import type { Meta } from '@storybook/react';
import { TicketTimelineEntryType } from '@cs/kyaku/models';
import { IntlProvider } from "react-intl";

const meta = {
  title: 'Example/Timeline',
  component: Timeline,
  parameters: {
    backgrounds: { disable: true },
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    
  },
} satisfies Meta<typeof Timeline>;

const items: Record<string, TimelineItemType> = 
 {
  '1': {
    id: '1',
    type: TicketTimelineEntryType.Chat,
    createdAt: new Date("2023-05-06T11:23:45.389Z"),
    customerId: '1',
    entry: {
      text: 'can ya help me change a product of purchase?'
    },
    customerCreatedBy: {
      id: '1',
      email: 'leslie.alexandre@example.com',
      name: 'Leslie Alexandre',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    userCreatedBy: null,
  },
  '2': {
    id: '2',
    type: TicketTimelineEntryType.Chat,
    createdAt: new Date("2023-05-07T22:40:00.000Z"),
    customerId: '1',
    entry: {
      text: 'Can you tell me which product you would like to change?'
    },
    customerCreatedBy: null,
    userCreatedBy: {
      id: '2',
      email: 'bot@example.com',
      name: 'Bot',
      image: null
    },
  },
  '3': {
    id: '3',
    type: TicketTimelineEntryType.Chat,
    createdAt: new Date("2023-05-08T22:40:00.000Z"),
    customerId: '1',
    entry: {
      text: 'Can you tell me which product you would like to change?'
    },
    customerCreatedBy: {
      id: '1',
      email: 'leslie.alexandre@example.com',
      name: 'Leslie Alexandre',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    userCreatedBy: null,
  },
  '4': {
    id: '4',
    type: TicketTimelineEntryType.AssignmentChanged,
    createdAt: new Date("2023-05-20T20:54:41.389Z"),
    customerId: '1',
    entry: {
      oldAssignedToId: null,
      newAssignedToId: "3cd0ab05-252f-4294-85f4-190e071db486",
      oldAssignedTo: null,
      newAssignedTo: {
        id: "3cd0ab05-252f-4294-85f4-190e071db486",
        email: "tom.cook@example.com",
        name: "Tom Cook",
        image: null
      }
    },
    customerCreatedBy: {
      id: "40cebacc-c7ae-4b5b-8072-3122d572c6d4",
      email: "bot@example.com",
      name: "Bot",
      avatarUrl: null
    },
    userCreatedBy: null,
  }
 }

export default meta;

export const Test = () => {
  return <IntlProvider locale="en">
    <Timeline items={Object.keys(items)} renderItem={({itemId}) => <TimelineItem item={items[itemId]} nextItemId={undefined} previousItemId={undefined} />} ticketId="ticket-id" />
  </IntlProvider>
}