import type { Meta } from '@storybook/react';
import { IntlProvider } from 'react-intl';

import { TicketPriority, TicketStatus } from '@kyaku/kyaku/models';
import { Timeline } from '@kyaku/ui/timeline';
import { TimelineItem } from '@kyaku/ui/timeline-item';

const meta = {
  title: 'Example/Timeline',
  component: Timeline,
  parameters: {
    backgrounds: { disable: true },
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Timeline>;

const customer = {
  id: '1',
  email: 'leslie.alexandre@example.com',
  name: 'Leslie Alexandre',
  avatarUrl:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const user = {
  id: '2',
  email: 'bot@example.com',
  name: 'Bot',
  image: null,
};

const bugLabelType = {
  id: '1',
  name: 'Bug',
  createdAt: new Date('2023-05-06T11:23:45.389Z'),
  createdById: '1',
  updatedAt: null,
  updatedById: null,
  icon: 'bug',
  archivedAt: null,
};

const items: Record<number, TimelineItem> = {
  1: {
    id: '1',
    createdAt: '2023-05-06T11:23:45.389Z',
    customer: customer,
    entry: {
      __typename: 'ChatEntry',
      text: 'can ya help me change a product of purchase?',
    },
    customerCreatedBy: customer,
    userCreatedBy: null,
  },
  2: {
    id: '2',
    createdAt: '2023-05-07T22:40:00.000Z',
    customer: customer,
    entry: {
      __typename: 'ChatEntry',
      text: 'Can you tell me which product you would like to change?',
    },
    customerCreatedBy: null,
    userCreatedBy: user,
  },
  3: {
    id: '3',
    createdAt: '2023-05-08T22:40:00.000Z',
    customer: customer,
    entry: {
      __typename: 'ChatEntry',
      text: 'Can you tell me which product you would like to change?',
    },
    customerCreatedBy: customer,
    userCreatedBy: null,
  },
  4: {
    id: '4',
    createdAt: '2023-05-20T20:54:41.389Z',
    customer: customer,
    entry: {
      __typename: 'AssignmentChangedEntry',
      oldAssignedToId: null,
      newAssignedToId: '3cd0ab05-252f-4294-85f4-190e071db486',
      oldAssignedTo: null,
      newAssignedTo: {
        id: '3cd0ab05-252f-4294-85f4-190e071db486',
        email: 'tom.cook@example.com',
        name: 'Tom Cook',
        image: null,
      },
    },
    customerCreatedBy: null,
    userCreatedBy: user,
  },
  5: {
    id: '5',
    createdAt: '2023-05-21T20:54:41.389Z',
    customer: customer,
    entry: {
      __typename: 'NoteEntry',
      text: '',
      rawContent:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"test","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    },
    customerCreatedBy: null,
    userCreatedBy: user,
  },
  6: {
    id: '6',
    createdAt: '2023-05-22T20:54:51.389Z',
    customer: customer,
    entry: {
      __typename: 'PriorityChangedEntry',
      oldPriority: TicketPriority.Low,
      newPriority: TicketPriority.High,
    },
    customerCreatedBy: null,
    userCreatedBy: user,
  },
  7: {
    id: '7',
    createdAt: '2023-05-22T20:55:41.389Z',
    customer: customer,
    entry: {
      __typename: 'LabelsChangedEntry',
      oldLabelIds: [],
      oldLabels: [],
      newLabelIds: ['1'],
      newLabels: [
        {
          id: '1',
          ticketId: '1',
          labelTypeId: '1',
          archivedAt: null,
          labelType: bugLabelType,
        },
      ],
    },
    customerCreatedBy: null,
    userCreatedBy: user,
  },
  8: {
    id: '8',
    createdAt: '2023-05-23T20:55:41.389Z',
    customer: customer,
    entry: {
      __typename: 'StatusChangedEntry',
      oldStatus: TicketStatus.Todo,
      newStatus: TicketStatus.Done,
    },
    customerCreatedBy: null,
    userCreatedBy: user,
  },
};

export default meta;

export const OldestToNewest = () => {
  return (
    <IntlProvider locale="en">
      <Timeline
        items={Object.keys(items)}
        renderItem={({ itemId }) => (
          <TimelineItem
            item={items[Number(itemId)]}
            nextItemId={
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              items[Number(itemId) + 1] !== undefined
                ? (Number(itemId) + 1).toString()
                : undefined
            }
            previousItemId={
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              items[Number(itemId) - 1] !== undefined
                ? (Number(itemId) - 1).toString()
                : undefined
            }
          />
        )}
        ticketId="ticket-id"
      />
    </IntlProvider>
  );
};
