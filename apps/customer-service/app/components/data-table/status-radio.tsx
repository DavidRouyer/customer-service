'use client';

import { useNavigate } from '@tanstack/react-router';
import { CheckCircle2, CircleDot } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@kyaku/kyaku/models';

import {
  StatusRadioGroup,
  StatusRadioGroupItem,
} from '~/components/data-table/status-radio-group';
import { Route } from '~/routes/_authed/_layout.index';

export const StatusRadio = () => {
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <StatusRadioGroup
      defaultValue={TicketStatus.Todo}
      onValueChange={(value) =>
        navigate({
          search: (old) => ({ ...old, statuses: value as TicketStatus }),
        })
      }
    >
      <StatusRadioGroupItem value={TicketStatus.Todo} className="gap-2">
        <CircleDot className="size-4 text-warning" />
        <span>
          <FormattedMessage id="ticket.statuses.todo" />
        </span>
      </StatusRadioGroupItem>
      <StatusRadioGroupItem value={TicketStatus.Done} className="gap-2">
        <CheckCircle2 className="size-4 text-valid" />
        <span>
          <FormattedMessage id="ticket.statuses.done" />
        </span>
      </StatusRadioGroupItem>
    </StatusRadioGroup>
  );
};
