import { useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import { getInitials } from '@cs/kyaku/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@cs/ui/avatar';
import { Button } from '@cs/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@cs/ui/dropdown-menu';

import { useMyUserInfoQuery } from '~/graphql/generated/client';

interface UserNavProps {
  showLabel?: boolean;
}

export function UserNav({ showLabel = false }: UserNavProps) {
  const { data: myUserInfo } = useMyUserInfoQuery(undefined, {
    select: (data) => ({ user: data.myUserInfo }),
  });
  const formRef = useRef<HTMLFormElement>(null);

  if (!myUserInfo?.user) return null;

  return (
    <>
      <form ref={formRef} /*action={handleSignOut}*/></form>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {showLabel ? (
            <button
              type="button"
              className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-foreground hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <Avatar className="size-8">
                <AvatarImage src={myUserInfo.user.image ?? undefined} />
                <AvatarFallback>
                  {getInitials(myUserInfo.user.name ?? '')}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">
                <FormattedMessage id="layout.your_profile" />
              </span>
              <span aria-hidden="true">{myUserInfo.user.name}</span>
            </button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="relative size-8 rounded-full"
            >
              <Avatar className="size-9">
                <AvatarImage
                  src={myUserInfo.user.image ?? undefined}
                  alt={myUserInfo.user.name ?? ''}
                />
                <AvatarFallback>
                  {getInitials(myUserInfo.user.name ?? '')}
                </AvatarFallback>
              </Avatar>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {myUserInfo.user.name ?? ''}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {myUserInfo.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => formRef.current?.requestSubmit()}>
            <FormattedMessage id="logout" />
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
