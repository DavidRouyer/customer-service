import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@cs/ui';

import { api } from '~/lib/api';
import { matchPath } from '~/lib/path';
import { getInitials } from '~/lib/string';
import { cn } from '../../../../../packages/design-system/ui/src/utils/cn';

export const TeamMemberList: FC = () => {
  const { data: sessionData } = api.auth.getSession.useQuery();
  const pathname = usePathname();
  const [usersData] = api.user.all.useSuspenseQuery();
  const [statsData] = api.ticket.stats.useSuspenseQuery();

  return usersData
    ?.filter((user) => user.id !== sessionData?.user.id)
    .map((user) => (
      <li key={user.id}>
        <Link
          href={`/dashboard/contact/${user.id}`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted hover:text-foreground',
            matchPath(pathname, `/dashboard/contact/${user.id}`) &&
              'bg-muted text-foreground'
          )}
        >
          <div className="flex items-center gap-x-3 truncate">
            <Avatar className="h-4 w-4 shrink-0">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{getInitials(user.name ?? '')}</AvatarFallback>
            </Avatar>
            <span className="truncate">{user.name}</span>
          </div>
          {statsData?.[`assignedTo${user.id}`]}
        </Link>
      </li>
    ));
};

TeamMemberList.displayName = 'TeamMemberList';
