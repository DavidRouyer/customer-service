import { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { RelativeTime } from '@/components/RelativeTime/RelativeTime';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Ticket as TicketType } from '@/gql/graphql';
import { getInitials } from '@/lib/string';

export type TicketProps = {
  ticket: TicketType;
};

export const Ticket: FC<TicketProps> = ({ ticket }) => {
  const { search } = useLocation();
  return (
    <li key={ticket.id}>
      <NavLink
        to={`/tickets/${ticket.id}${search}`}
        className="flex gap-x-4 py-5"
      >
        <Avatar className="h-12 w-12">
          <AvatarImage src={ticket.contact.imageUrl || undefined} />
          <AvatarFallback>{getInitials(ticket.contact.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-auto">
          <div className="flex items-baseline justify-between gap-x-4">
            <p className="text-sm font-semibold leading-6 text-gray-900">
              {ticket.contact.name}
            </p>
            <p className="flex-none text-xs text-gray-600">
              <time dateTime={ticket.createdAt}>
                <RelativeTime dateTime={ticket.createdAt} />
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
