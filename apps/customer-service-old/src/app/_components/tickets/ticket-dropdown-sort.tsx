'use client';

import type { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@cs/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@cs/ui/dropdown-menu';

import {
  getUpdatedSearchParams,
  ORDER_BY_QUERY_PARAM,
} from '~/app/lib/search-params';

export const TicketDropdownSort: FC<{
  orderBy: 'newest' | 'oldest';
}> = ({ orderBy }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="flex items-center justify-between gap-x-1 text-sm leading-6"
          >
            {
              {
                newest: <FormattedMessage id="ticket.sort_by.newest" />,
                oldest: <FormattedMessage id="ticket.sort_by.oldest" />,
              }[orderBy]
            }
            <ChevronDown className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                router.replace(
                  `${pathname}?${getUpdatedSearchParams(
                    searchParams,
                    ORDER_BY_QUERY_PARAM,
                    'newest'
                  ).toString()}`
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
                    ORDER_BY_QUERY_PARAM,
                    'oldest'
                  ).toString()}`
                )
              }
            >
              <FormattedMessage id="ticket.sort_by.oldest" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
