import type { FC } from 'react';
import { Link, useRouteContext } from '@tanstack/react-router';
import { BarChart3, BookmarkX, Users } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { getInitials } from '@kyaku/kyaku/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@kyaku/ui/avatar';

export const InboxList: FC = () => {
  const { session } = useRouteContext({ from: '__root__' });

  return (
    <>
      <li>
        <Link
          to="/"
          className='flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted aria-[current="page"]:bg-muted aria-[current="page"]:text-foreground'
        >
          <div className="flex items-center gap-x-3 truncate">
            <Users className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              <FormattedMessage id="layout.tickets.all_tickets" />
            </span>
          </div>
        </Link>
      </li>
      <li>
        <Link
          to="/my-inbox"
          className='flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted aria-[current="page"]:bg-muted aria-[current="page"]:text-foreground'
        >
          <div className="flex items-center gap-x-3 truncate">
            <Avatar className="size-4 shrink-0">
              <AvatarImage src={session?.user?.image ?? undefined} />
              <AvatarFallback>
                {getInitials(session?.user?.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              <FormattedMessage id="layout.tickets.my_tickets" />
            </span>
          </div>
        </Link>
      </li>
      <li>
        <Link
          to="/unassigned"
          className='flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted aria-[current="page"]:bg-muted aria-[current="page"]:text-foreground'
        >
          <div className="flex items-center gap-x-3 truncate">
            <BookmarkX className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              <FormattedMessage id="layout.tickets.unassigned_tickets" />
            </span>
          </div>
        </Link>
      </li>
      <li>
        <Link
          to="/reports"
          className='flex items-center gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted aria-[current="page"]:bg-muted aria-[current="page"]:text-foreground'
        >
          <BarChart3 className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">
            <FormattedMessage id="layout.reports" />
          </span>
        </Link>
      </li>
    </>
  );
};

InboxList.displayName = 'InboxList';
