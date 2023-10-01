import { FC } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BarChart3, BookmarkX, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { api } from '~/utils/api';
import { matchParams, matchPath } from '~/utils/path';
import { FILTER_QUERY_PARAM } from '~/utils/search-params';
import { getInitials } from '~/utils/string';
import { cn } from '~/utils/utils';

export const InboxList: FC = () => {
  const session = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [statsData] = api.ticket.stats.useSuspenseQuery();

  return (
    <>
      <li>
        <Link
          href={`/tickets?${FILTER_QUERY_PARAM}=me`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted',
            matchPath(pathname, '/tickets') &&
              matchParams(searchParams, {
                [`${FILTER_QUERY_PARAM}`]: ['me'],
              }) &&
              'bg-muted text-foreground'
          )}
        >
          <div className="flex items-center gap-x-3 truncate">
            <Avatar className="h-4 w-4 shrink-0">
              <AvatarImage src={session.data?.user.image ?? undefined} />
              <AvatarFallback>
                {getInitials(session.data?.user.name ?? '')}
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
          href={`/tickets?${FILTER_QUERY_PARAM}=all`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted',
            matchPath(pathname, '/tickets') &&
              matchParams(searchParams, {
                [`${FILTER_QUERY_PARAM}`]: [null, 'all'],
              }) &&
              'bg-muted text-foreground'
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
          href={`/tickets?${FILTER_QUERY_PARAM}=unassigned`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted',
            matchPath(pathname, '/tickets') &&
              matchParams(searchParams, {
                [`${FILTER_QUERY_PARAM}`]: ['unassigned'],
              }) &&
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
