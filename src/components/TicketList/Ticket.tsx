import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { RelativeTime } from '@/components/RelativeTime/RelativeTime';
import { TicketSummary } from '@/stores/ticketList';

export type TicketProps = {
  ticket: TicketSummary;
};

export const Ticket: FC<TicketProps> = ({ ticket }) => {
  const { search } = useLocation();
  return (
    <li key={ticket.id}>
      <NavLink
        to={`/tickets/${ticket.id}${search}`}
        className="flex gap-x-4 py-5"
      >
        <img
          className="h-12 w-12 flex-none rounded-full bg-gray-50"
          src={ticket.user.imageUrl}
          alt=""
        />
        <div className="flex-auto">
          <div className="flex items-baseline justify-between gap-x-4">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              {ticket.user.name}
            </p>
            <p className="flex-none text-xs text-gray-600">
              <time dateTime={ticket.openingDate}>
                <RelativeTime dateTime={ticket.openingDate} />
              </time>
            </p>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">
            {ticket.content}
          </p>
        </div>
      </NavLink>
    </li>
  );
};
