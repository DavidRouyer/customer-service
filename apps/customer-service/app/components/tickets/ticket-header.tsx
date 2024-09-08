import type { FC } from 'react';
import { BookOpenCheck, HardDriveUpload } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@cs/ui/button';

import { TicketStatus, useTicketQuery } from '~/graphql/generated/client';
import { useMarkAsDoneTicket } from '~/hooks/use-mark-as-done-ticket';
import { useMarkAsOpenTicket } from '~/hooks/use-mark-as-open-ticket';

export const TicketHeader: FC<{ ticketId: string }> = ({ ticketId }) => {
  const { data: ticketData } = useTicketQuery(
    { ticketId: ticketId },
    {
      select: (data) => data.ticket,
    }
  );

  const { mutate: markAsDoneTicket } = useMarkAsDoneTicket();
  const { mutate: markAsOpenTicket } = useMarkAsOpenTicket();

  if (!ticketData) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b pb-6">
      <h3 className="text-base font-semibold leading-6 text-foreground">
        <span className="text-muted-foreground">#{ticketData.id}</span>{' '}
        {ticketData.customer.name}
      </h3>
      <div className="flex items-center gap-x-2">
        {ticketData.status === TicketStatus.Done ? (
          <Button
            type="button"
            onClick={() => {
              markAsOpenTicket({ input: { ticketId: ticketId } });
            }}
            className="flex items-center gap-x-1"
          >
            <HardDriveUpload className="size-4" />
            <FormattedMessage id="ticket.actions.reopen" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => {
              markAsDoneTicket({ input: { ticketId: ticketId } });
            }}
            className="flex items-center gap-x-1"
          >
            <BookOpenCheck className="size-4" />
            <FormattedMessage id="ticket.actions.resolve" />
          </Button>
        )}
      </div>
    </div>
  );
};

TicketHeader.displayName = 'TicketHeader';
