import { FC } from 'react';
import { CheckCircle2 } from 'lucide-react';

import { RelativeTime } from '~/components/ui/relative-time';
import { cn } from '~/utils/utils';

const activity = [
  {
    id: 1,
    type: 'created',
    person: { name: 'Leslie Alexander' },
    date: '7d ago',
    dateTime: '2023-01-23T10:32',
  },
  {
    id: 2,
    type: 'assigned',
    person: { name: 'Tom Cook' },
    date: '6d ago',
    dateTime: '2023-01-23T11:03',
  },
  {
    id: 3,
    type: 'commented',
    person: {
      name: 'Sophie Radcliff',
      avatarUrl:
        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    comment: 'Called client, they are not happy with the product.',
    date: '3d ago',
    dateTime: '2023-01-23T15:56',
  },
  {
    id: 5,
    type: 'resolved',
    person: { name: 'Tom Cook' },
    date: '1d ago',
    dateTime: '2023-01-24T09:20',
  },
];

export const ActivityPanel: FC = () => {
  return (
    <ul className="space-y-6">
      {activity.map((activityItem, activityItemIdx) => (
        <li key={activityItem.id} className="relative flex gap-x-4">
          <div
            className={cn(
              activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
              'absolute left-0 top-0 flex w-6 justify-center'
            )}
          >
            <div className="w-px bg-gray-200" />
          </div>
          {activityItem.type === 'commented' ? (
            <>
              <img
                src={activityItem.person.avatarUrl}
                alt=""
                className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
              />
              <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                <div className="flex justify-between gap-x-4">
                  <div className="py-0.5 text-xs leading-5 text-gray-500">
                    <span className="font-medium text-gray-900">
                      {activityItem.person.name}
                    </span>{' '}
                    commented
                  </div>
                  <time
                    dateTime={activityItem.dateTime}
                    className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                  >
                    <RelativeTime dateTime={new Date(activityItem.dateTime)} />
                  </time>
                </div>
                <p className="text-sm leading-6 text-gray-500">
                  {activityItem.comment}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
                {activityItem.type === 'resolved' ? (
                  <CheckCircle2
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                )}
              </div>
              <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
                <span className="font-medium text-gray-900">
                  {activityItem.person.name}
                </span>{' '}
                {activityItem.type} the ticket.
              </p>
              <time
                dateTime={activityItem.dateTime}
                className="flex-none py-0.5 text-xs leading-5 text-gray-500"
              >
                <RelativeTime dateTime={new Date(activityItem.dateTime)} />
              </time>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

ActivityPanel.displayName = 'ActivityPanel';
