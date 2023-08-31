'use client';

import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/Avatar';
import { useTicket } from '~/hooks/useTicket/TicketProvider';
import { getInitials } from '~/utils/string';

export const CurrentUser: FC = () => {
  const { currentUser } = useTicket();

  if (!currentUser) return null;

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
      href="#"
      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={currentUser.image} />
        <AvatarFallback>{getInitials(currentUser.fullName)}</AvatarFallback>
      </Avatar>
      <span className="sr-only">
        <FormattedMessage id="layout.your_profile" />
      </span>
      <span aria-hidden="true">{currentUser.fullName}</span>
    </a>
  );
};

CurrentUser.displayName = 'CurrentUser';
