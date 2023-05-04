import { FC } from 'react';

import { RelativeTime } from '@/components/RelativeTime/RelativeTime';
import { TicketSummary } from '@/components/TicketList/TicketList';

export type TicketProps = {
  comment: TicketSummary;
};

export const Ticket: FC<TicketProps> = ({ comment }) => {
  return (
    <li key={comment.id} className="flex gap-x-4 py-5">
      <img
        className="h-12 w-12 flex-none rounded-full bg-gray-50"
        src={comment.imageUrl}
        alt=""
      />
      <div className="flex-auto">
        <div className="flex items-baseline justify-between gap-x-4">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {comment.name}
          </p>
          <p className="flex-none text-xs text-gray-600">
            <time dateTime={comment.dateTime}>
              <RelativeTime dateTime={comment.dateTime} />
            </time>
          </p>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">
          {comment.content}
        </p>
      </div>
    </li>
  );
};
