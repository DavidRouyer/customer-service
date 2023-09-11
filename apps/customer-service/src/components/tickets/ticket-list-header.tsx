'use client';

import { FC } from 'react';
import Link from 'next/link';
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export const TicketListHeader: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getUpdatedSearchParams = (
    searchParams: ReadonlyURLSearchParams,
    oldValue: string,
    newValue: string
  ) => {
    const updatedSeachParams = new URLSearchParams(
      Array.from(searchParams.entries())
    );

    if (
      !updatedSeachParams.get('orderBy') ||
      updatedSeachParams.get('orderBy') === oldValue
    ) {
      updatedSeachParams.set('orderBy', newValue);
    }

    return updatedSeachParams.toString();
  };

  return (
    <header className="flex items-center justify-between border-b pb-6">
      <h1 className="text-base font-semibold leading-7 text-white">Inbox</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-between gap-x-1 px-0 text-sm leading-6"
          >
            <FormattedMessage id="ticket.sort_by.newest" />
            <ChevronDown className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                router.replace(
                  `${pathname}?${getUpdatedSearchParams(
                    searchParams,
                    'oldest',
                    'newest'
                  )}`
                )
              }
            >
              <FormattedMessage id="ticket.sort_by.newest" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.replace(
                  `${pathname}?${getUpdatedSearchParams(
                    searchParams,
                    'newest',
                    'oldest'
                  )}`
                )
              }
            >
              <FormattedMessage id="ticket.sort_by.oldest" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
