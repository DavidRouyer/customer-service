'use client';

import { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/database/schema/ticket';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import {
  getUpdatedSearchParams,
  ORDER_BY_QUERY_PARAM,
  STATUS_QUERY_PARAM,
} from '~/utils/search-params';

export const TicketListHeader: FC<{
  status: TicketStatus;
  orderBy: 'newest' | 'oldest';
}> = ({ status, orderBy }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <header className="flex items-center justify-between border-b px-4 py-6 sm:px-6">
      <h1 className="text-base font-semibold leading-7 text-white">Inbox</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            className="flex items-center justify-between gap-x-1 text-sm leading-6"
          >
            {
              {
                Resolved: <FormattedMessage id="ticket.statuses.resolved" />,
                Open: <FormattedMessage id="ticket.statuses.open" />,
              }[status]
            }
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
                    STATUS_QUERY_PARAM,
                    'open'
                  ).toString()}`
                )
              }
            >
              <FormattedMessage id="ticket.statuses.open" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.replace(
                  `${pathname}?${getUpdatedSearchParams(
                    searchParams,
                    STATUS_QUERY_PARAM,
                    'resolved'
                  ).toString()}`
                )
              }
            >
              <FormattedMessage id="ticket.statuses.resolved" />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            className="flex items-center justify-between gap-x-1 text-sm leading-6"
          >
            {
              {
                newest: <FormattedMessage id="ticket.sort_by.newest" />,
                oldest: <FormattedMessage id="ticket.sort_by.oldest" />,
              }[orderBy]
            }
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
    </header>
  );
};
