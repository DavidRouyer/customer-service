import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AtSign, BarChart3, BookmarkX, Users } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { api } from '~/lib/api';
import { matchPath } from '~/lib/path';
import { getInitials } from '~/lib/string';
import { cn } from '~/lib/utils';

export const InboxList: FC = () => {
  const { data: sessionData } = api.auth.getSession.useQuery();
  const pathname = usePathname();

  const [statsData] = api.ticket.stats.useSuspenseQuery();

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
            <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
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
            <Avatar className="h-4 w-4 shrink-0">
              <AvatarImage src={sessionData?.user.image ?? undefined} />
              <AvatarFallback>
                {getInitials(sessionData?.user.name ?? '')}
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
            <BookmarkX className="h-4 w-4 shrink-0" aria-hidden="true" />
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
            <AtSign className="h-4 w-4 shrink-0" aria-hidden="true" />
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
          <BarChart3 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">
            <FormattedMessage id="layout.reports" />
          </span>
        </Link>
      </li>
    </>
  );
};

InboxList.displayName = 'InboxList';
