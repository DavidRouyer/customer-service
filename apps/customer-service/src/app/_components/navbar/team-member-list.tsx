import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getInitials } from '@cs/kyaku/utils';
import { cn } from '@cs/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@cs/ui/avatar';

import { matchPath } from '~/app/lib/path';
import { useUsersQuery } from '~/graphql/generated/client';
import { api } from '~/trpc/react';

export const TeamMemberList: FC = () => {
  const { data: session } = api.auth.getSession.useQuery();
  const pathname = usePathname();
  const { data: usersData } = useUsersQuery(
    {
      first: 10,
    },
    {
      select: (data) => data.users,
    }
  );
  //const [statsData] = api.ticket.stats.useSuspenseQuery();
  const statsData = {
    total: 0,
    assignedToMe: 0,
    unassigned: 0,
    mentions: 0,
  };

  return usersData?.edges
    ?.filter((user) => user.node.id !== session?.user?.id)
    .map((user) => (
      <li key={user.node.id}>
        <Link
          href={`/dashboard/contact/${user.node.id}`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted hover:text-foreground',
            matchPath(pathname, `/dashboard/contact/${user.node.id}`) &&
              'bg-muted text-foreground'
          )}
        >
          <div className="flex items-center gap-x-3 truncate">
            <Avatar className="size-4 shrink-0">
              <AvatarImage src={user.node.image ?? undefined} />
              <AvatarFallback>
                {getInitials(user.node.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{user.node.name}</span>
          </div>
        </Link>
      </li>
    ));
};

TeamMemberList.displayName = 'TeamMemberList';
