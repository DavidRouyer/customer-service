import { FC } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { api } from '~/lib/api';
import { matchParams, matchPath } from '~/lib/path';
import { FILTER_QUERY_PARAM } from '~/lib/search-params';
import { getInitials } from '~/lib/string';
import { cn } from '~/lib/utils';

export const TeamMemberList: FC = () => {
  const session = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [contactsData] = api.contact.allWithUserId.useSuspenseQuery();
  const [statsData] = api.ticket.stats.useSuspenseQuery();

  return contactsData
    ?.filter((contact) => contact.id !== session?.data?.user.contactId)
    .map((contact) => (
      <li key={contact.id}>
        <Link
          href={`/tickets?${FILTER_QUERY_PARAM}=${contact.id}`}
          className={cn(
            'flex items-center justify-between gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-5 text-muted-foreground hover:bg-muted hover:text-foreground',
            matchPath(pathname, '/tickets') &&
              matchParams(searchParams, {
                [`${FILTER_QUERY_PARAM}`]: [contact.id.toString()],
              }) &&
              'bg-muted text-foreground'
          )}
        >
          <div className="flex items-center gap-x-3 truncate">
            <Avatar className="h-4 w-4 shrink-0">
              <AvatarImage src={contact.avatarUrl ?? undefined} />
              <AvatarFallback>{getInitials(contact.name ?? '')}</AvatarFallback>
            </Avatar>
            <span className="truncate">{contact.name}</span>
          </div>
          {statsData?.[`assignedTo${contact.id}`]}
        </Link>
      </li>
    ));
};

TeamMemberList.displayName = 'TeamMemberList';
