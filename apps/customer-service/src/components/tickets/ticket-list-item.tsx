import { FC } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FormattedMessage } from 'react-intl';

import { RouterOutputs } from '@cs/api';

import { MessageContent } from '~/components/messages/message-content';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { RelativeTime } from '~/components/ui/relative-time';
import { api } from '~/lib/api';
import { getInitials } from '~/lib/string';

export type TicketListItemProps = {
  ticket: NonNullable<RouterOutputs['ticket']['all']['data'][0]>;
};

export const TicketListItem: FC<TicketListItemProps> = ({ ticket }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: sessionData } = api.auth.getSession.useQuery();

  return (
    <section
      key={ticket.id}
      className={pathname === `/tickets/${ticket.id}` ? 'bg-muted' : ''}
    >
      <Link
        href={`/tickets/${ticket.id}?${searchParams.toString()}`}
        className="mx-4 flex gap-x-4 border-b py-5 last:border-0 sm:mx-6"
      >
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={ticket.author.avatarUrl ?? undefined}
            alt={ticket.author.name ?? ''}
          />
          <AvatarFallback>
            {getInitials(ticket.author.name ?? '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-auto">
          <div className="flex items-baseline justify-between gap-x-4">
            <p className="text-sm font-semibold leading-6 text-foreground">
              {ticket.author.name}
            </p>
            <p className="flex-none text-xs text-muted-foreground">
              <time dateTime={ticket.createdAt.toUTCString()}>
                <RelativeTime dateTime={ticket.createdAt} />
              </time>
            </p>
          </div>
          <div className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {sessionData?.user?.contactId === ticket.messages?.[0]?.authorId ? (
              <>
                <FormattedMessage id="you" />{' '}
              </>
            ) : null}
            {ticket.messages?.[0] ? (
              <MessageContent
                type={ticket.messages[0].contentType}
                content={ticket.messages[0].content}
              />
            ) : null}
          </div>
        </div>
      </Link>
    </section>
  );
};
