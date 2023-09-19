import { FC } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { api } from '~/utils/api';
import { FILTER_QUERY_PARAM } from '~/utils/search-params';

export const TeamMemberList: FC = () => {
  const session = useSession();
  const { data: contactsData } = api.contact.allWithUserId.useQuery();

  return (
    <ul className="flex flex-col gap-y-1">
      {contactsData
        ?.filter((contact) => contact.id !== session.data?.user?.contactId)
        ?.map((contact) => (
          <li key={contact.id}>
            <Link href={`/tickets?${FILTER_QUERY_PARAM}=${contact.id}`}>
              {contact.name}
            </Link>
          </li>
        ))}
    </ul>
  );
};

TeamMemberList.displayName = 'TeamMemberList';
