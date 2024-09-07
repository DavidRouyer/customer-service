'use client';

import type { FC } from 'react';
import { useNavigate } from '@tanstack/react-router';
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

import { Route } from '~/routes/_authed/ticket/_layout';

export const TicketDropdownSort: FC<{
  orderBy: 'newest' | 'oldest';
}> = ({ orderBy }) => {
  const navigate = useNavigate({ from: Route.fullPath });

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
                navigate({
                  search: (old) => ({ ...old, orderBy: 'newest' }),
                })
              }
            >
              <FormattedMessage id="ticket.sort_by.newest" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  search: (old) => ({ ...old, orderBy: 'oldest' }),
                })
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
