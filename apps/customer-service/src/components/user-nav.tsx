import { signOut } from 'next-auth/react';
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
import { useTicket } from '~/hooks/useTicket/TicketProvider';
import { getInitials } from '~/utils/string';

export function UserNav({ showLabel = false }) {
  const { currentUser } = useTicket();

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {showLabel ? (
          <button
            type="button"
            className="flex w-full items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.image} />
              <AvatarFallback>
                {getInitials(currentUser.fullName)}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">
              <FormattedMessage id="layout.your_profile" />
            </span>
            <span aria-hidden="true">{currentUser.fullName}</span>
          </button>
        ) : (
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser.image} alt={currentUser.fullName} />
              <AvatarFallback>
                {getInitials(currentUser.fullName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser.fullName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
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
