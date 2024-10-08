'use client';

import type { FC } from 'react';
import { Link } from '@tanstack/react-router';

import { getInitials } from '@kyaku/kyaku/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@kyaku/ui/avatar';
import { RelativeTime } from '@kyaku/ui/relative-time';

import type { TicketsQuery } from '~/graphql/generated/client';

export interface TicketListItemProps {
  ticket: NonNullable<TicketsQuery['tickets']['edges'][number]['node']>;
  currentUserId?: string;
}

export const TicketListItem: FC<TicketListItemProps> = ({
  ticket,
  currentUserId,
}) => {
  return (
    <Link
      to="/ticket/$ticketId"
      params={{ ticketId: ticket.id }}
      className='block aria-[current="page"]:bg-muted'
    >
      <div className="mx-4 flex gap-x-4 border-b py-5 last:border-0 sm:mx-6">
        <Avatar className="size-12">
          <AvatarImage
            src={ticket.customer.avatarUrl ?? undefined}
            alt={ticket.customer.name ?? ''}
          />
          <AvatarFallback>
            {getInitials(ticket.customer.name ?? '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-auto">
          <div className="flex items-baseline justify-between gap-x-4">
            <p className="text-sm font-semibold leading-6 text-foreground">
              {ticket.customer.name}
            </p>
            <p className="flex-none text-xs text-muted-foreground">
              <time dateTime={ticket.createdAt}>
                <RelativeTime dateTime={new Date(ticket.createdAt)} />
              </time>
            </p>
          </div>
          {/*<div className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {currentUserId === ticket.timeline?.[0]?.userCreatedById ? (
              <>
                <FormattedMessage id="you" />{' '}
              </>
            ) : null}
            {ticket.timeline?.[0]
              ? (ticket.timeline?.[0]?.entry as TicketChat | TicketNote).text
              : null}
            </div>*/}
        </div>
      </div>
    </Link>
  );
};
