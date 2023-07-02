import { FC } from 'react';
import { Trans } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useTicket } from '@/hooks/useTicket/TicketProvider';
import { getInitials } from '@/lib/string';

export const CurrentUser: FC = () => {
  const { currentUser } = useTicket();

  if (!currentUser) return null;

  return (
    <a
      href="#"
      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={currentUser.avatarUrl} />
        <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
      </Avatar>
      <span className="sr-only">
        <Trans i18nKey="layout.your_profile" />
      </span>
      <span aria-hidden="true">{currentUser.fullName}</span>
    </a>
  );
};

CurrentUser.displayName = 'CurrentUser';
