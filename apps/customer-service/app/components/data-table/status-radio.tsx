'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, CircleDot } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/kyaku/models';

import {
  StatusRadioGroup,
  StatusRadioGroupItem,
} from '~/app/_components/data-table/status-radio-group';

export const StatusRadio = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <StatusRadioGroup
      defaultValue={TicketStatus.Open}
      onValueChange={(value) =>
        router.push(pathname + '?' + createQueryString('status', value))
      }
    >
      <StatusRadioGroupItem value={TicketStatus.Open} className="gap-2">
        <CircleDot className="size-4 text-warning" />
        <span>
          <FormattedMessage id="ticket.statuses.open" />
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
