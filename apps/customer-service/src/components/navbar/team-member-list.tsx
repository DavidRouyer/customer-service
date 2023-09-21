import { FC } from 'react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { api } from '~/utils/api';
import { FILTER_QUERY_PARAM } from '~/utils/search-params';
import { getInitials } from '~/utils/string';

export const TeamMemberList: FC = () => {
  const [contactsData] = api.contact.allWithUserId.useSuspenseQuery();
  const [statsData] = api.ticket.stats.useSuspenseQuery();

  return contactsData?.map((contact) => (
    <li key={contact.id}>
      <Link
        href={`/tickets?${FILTER_QUERY_PARAM}=${contact.id}`}
        className="flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-muted hover:text-foreground"
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
