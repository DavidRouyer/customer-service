import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AtSign, BarChart3, BookmarkX, Users } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { getInitials } from '@cs/kyaku/utils';
import { cn } from '@cs/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@cs/ui/avatar';

import { matchPath } from '~/app/lib/path';
import { useMyUserInfoQuery } from '~/graphql/generated/client';

export const InboxList: FC = () => {
  const { data: myUserInfo } = useMyUserInfoQuery(undefined, {
    select: (data) => ({ user: data.myUserInfo }),
  });
  const pathname = usePathname();

  //const [statsData] = api.ticket.stats.useSuspenseQuery();
  const statsData = {
    total: 0,
    assignedToMe: 0,
    unassigned: 0,
    mentions: 0,
  };

  return (
    <>
      <li>
        <Link
          href={`/dashboard`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted',
            matchPath(pathname, '/dashboard') && 'bg-muted text-foreground'
          )}
        >
          <div className="flex items-center gap-x-3 truncate">
            <Users className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              <FormattedMessage id="layout.tickets.all_tickets" />
            </span>
          </div>

          {statsData?.total}
        </Link>
      </li>
      <li>
        <Link
          href={`/dashboard/my-inbox`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted',
            matchPath(pathname, '/dashboard/my-inbox') &&
              'bg-muted text-foreground'
          )}
        >
          <div className="flex items-center gap-x-3 truncate">
            <Avatar className="size-4 shrink-0">
              <AvatarImage src={myUserInfo?.user?.image ?? undefined} />
              <AvatarFallback>
                {getInitials(myUserInfo?.user?.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">
              <FormattedMessage id="layout.tickets.my_tickets" />
            </span>
          </div>

          {statsData?.assignedToMe}
        </Link>
      </li>
      <li>
        <Link
          href={`/dashboard/unassigned`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted',
            matchPath(pathname, '/dashboard/unassigned') &&
              'bg-muted text-foreground'
          )}
        >
          <div className="flex items-center gap-x-3 truncate">
            <BookmarkX className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              <FormattedMessage id="layout.tickets.unassigned_tickets" />
            </span>
          </div>

          {statsData?.unassigned}
        </Link>
      </li>
      <li>
        <Link
          href={`/dashboard/mentions`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted',
            matchPath(pathname, '/dashboard/mentions') &&
              'bg-muted text-foreground'
          )}
        >
          <div className="flex items-center gap-x-3 truncate">
            <AtSign className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              <FormattedMessage id="layout.tickets.mentions" />
            </span>
          </div>

          {statsData?.mentions}
        </Link>
      </li>
      <li>
        <Link
          href="/reports"
          className={cn(
            'flex items-center gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted',
            matchPath(pathname, '/reports') && 'bg-muted text-foreground'
          )}
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
