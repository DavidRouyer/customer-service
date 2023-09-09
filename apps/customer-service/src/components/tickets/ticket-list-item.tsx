import { FC } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { RelativeTime } from '~/components/ui/relative-time';
import { Ticket } from '~/hooks/useTicket/Ticket';
import { getInitials } from '~/utils/string';

export type TicketListItemProps = {
  ticket: Ticket;
};

export const TicketListItem: FC<TicketListItemProps> = ({ ticket }) => {
  const searchParams = useSearchParams();
  return (
    <section key={ticket.id}>
      <Link
        href={`/tickets/${ticket.id}${searchParams.toString()}`}
        className="flex gap-x-4 py-5"
      >
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={ticket.contact.avatarUrl ?? undefined}
            alt={ticket.contact.name ?? ''}
          />
          <AvatarFallback>
            {getInitials(ticket.contact.name ?? '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-auto">
          <div className="flex items-baseline justify-between gap-x-4">
            <p className="text-sm font-semibold leading-6 text-foreground">
              {ticket.contact.name}
            </p>
            <p className="flex-none text-xs text-muted-foreground">
              <time dateTime={ticket.createdAt.toUTCString()}>
                <RelativeTime dateTime={ticket.createdAt} />
              </time>
            </p>
          </div>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {ticket.content}
          </p>
        </div>
      </Link>
    </section>
  );
};
