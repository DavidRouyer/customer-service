import { signOut, useSession } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { getInitials } from '~/utils/string';

export function UserNav({ showLabel = false }) {
  const session = useSession();

  if (!session.data?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {showLabel ? (
          <button
            type="button"
            className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-foreground hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.data.user.image ?? undefined} />
              <AvatarFallback>
                {getInitials(session.data.user.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">
              <FormattedMessage id="layout.your_profile" />
            </span>
            <span aria-hidden="true">{session.data?.user.name}</span>
          </button>
        ) : (
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={session.data.user.image ?? undefined}
                alt={session.data.user.name ?? ''}
              />
              <AvatarFallback>
                {getInitials(session.data.user.name ?? '')}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.data.user.name ?? ''}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.data.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() =>
            signOut({
              redirect: true,
              callbackUrl: '/',
            })
          }
        >
          <FormattedMessage id="logout" />
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
