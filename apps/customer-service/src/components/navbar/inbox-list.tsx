import { FC } from 'react';
import Link from 'next/link';
import { BarChart3, BookmarkX, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { api } from '~/utils/api';
import { FILTER_QUERY_PARAM } from '~/utils/search-params';
import { getInitials } from '~/utils/string';

export const InboxList: FC = () => {
  const session = useSession();

  const [statsData] = api.ticket.stats.useSuspenseQuery();

  return (
    <>
      <li>
        <Link
          href={`/tickets?${FILTER_QUERY_PARAM}=me`}
          className="flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
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
          className="flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
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
          className="flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
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
          className="flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <BarChart3 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <FormattedMessage id="layout.reports" />
        </Link>
      </li>
    </>
  );
};

InboxList.displayName = 'InboxList';
