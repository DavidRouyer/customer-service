'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FormattedMessage } from 'react-intl';

import { RouterOutputs } from '@cs/api';
import { TicketChat, TicketNote } from '@cs/kyaku/models';
import { Avatar, AvatarFallback, AvatarImage } from '@cs/ui/avatar';

import { RelativeTime } from '~/app/_components/ui/relative-time/relative-time';
import { getInitials } from '~/app/lib/string';

export type TicketListItemProps = {
  ticket: NonNullable<RouterOutputs['ticket']['all']['data'][0]>;
  currentUserId?: string;
};

export const TicketListItem: FC<TicketListItemProps> = ({
  ticket,
  currentUserId,
}) => {
  const pathname = usePathname();

  return (
    <section className={pathname === `/ticket/${ticket.id}` ? 'bg-muted' : ''}>
      <Link
        href={`/ticket/${ticket.id}`}
        className="mx-4 flex gap-x-4 border-b py-5 last:border-0 sm:mx-6"
      >
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
              <time dateTime={ticket.createdAt.toUTCString()}>
                <RelativeTime dateTime={ticket.createdAt} />
              </time>
            </p>
          </div>
          <div className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {currentUserId === ticket.timeline?.[0]?.userCreatedById ? (
              <>
                <FormattedMessage id="you" />{' '}
              </>
            ) : null}
            {ticket.timeline?.[0]
              ? (ticket.timeline?.[0]?.entry as TicketChat | TicketNote).text
              : null}
          </div>
        </div>
      </Link>
    </section>
  );
};
