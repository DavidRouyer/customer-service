import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getInitials } from '@cs/kyaku/utils';
import { cn } from '@cs/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@cs/ui/avatar';

import { matchPath } from '~/app/lib/path';
import { api } from '~/trpc/react';

export const TeamMemberList: FC = () => {
  const { data: session } = api.auth.getSession.useQuery();
  const pathname = usePathname();
  const { data: usersData } = api.user.all.useQuery();
  //const [statsData] = api.ticket.stats.useSuspenseQuery();
  const statsData = {
    total: 0,
    assignedToMe: 0,
    unassigned: 0,
    mentions: 0,
  };

  return usersData
    ?.filter((user) => user.id !== session?.user?.id)
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
            <Avatar className="size-4 shrink-0">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{getInitials(user.name ?? '')}</AvatarFallback>
            </Avatar>
            <span className="truncate">{user.name}</span>
          </div>
        </Link>
      </li>
    ));
};

TeamMemberList.displayName = 'TeamMemberList';
