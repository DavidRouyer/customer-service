import { FC } from 'react';
import Link from 'next/link';

import { api } from '~/utils/api';

export const AgentList: FC = () => {
  const { data: contactsData } = api.contact.allWithUserId.useQuery();
  return (
    <ul className="flex flex-col gap-y-1">
      {contactsData?.map((contact) => (
        <li key={contact.id}>
          <Link href={`/tickets?filter=${contact.id}`}>{contact.name}</Link>
        </li>
      ))}
    </ul>
  );
};

AgentList.displayName = 'AgentList';
