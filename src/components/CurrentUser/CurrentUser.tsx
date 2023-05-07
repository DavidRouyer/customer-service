import { FC } from 'react';
import { Trans } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { getInitials } from '@/lib/string';
import { currentUserState } from '@/stores/currentUser';

export const CurrentUser: FC = () => {
  const currentUser = useRecoilValue(currentUserState);

  if (!currentUser) return null;

  return (
    <a
      href="#"
      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={currentUser.imageUrl} />
        <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
      </Avatar>
      <span className="sr-only">
        <Trans i18nKey="layout.your_profile" />
      </span>
      <span aria-hidden="true">{currentUser.name}</span>
    </a>
  );
};

CurrentUser.displayName = 'CurrentUser';
