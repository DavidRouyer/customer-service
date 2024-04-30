import { FC } from 'react';
import { BookOpenCheck, HardDriveUpload } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/kyaku/models';
import { Button } from '@cs/ui/button';

import { useMarkAsDoneTicket } from '~/app/_hooks/use-mark-as-done-ticket';
import { useMarkAsOpenTicket } from '~/app/_hooks/use-mark-as-open-ticket';
import { useTicketQuery } from '~/graphql/generated/client';

export const TicketHeader: FC<{ ticketId: string }> = ({ ticketId }) => {
  const { data: ticketData } = useTicketQuery(
    { id: ticketId },
    {
      select: (data) => data.ticket,
    }
  );

  const { markAsDoneTicket } = useMarkAsDoneTicket();
  const { markAsOpenTicket } = useMarkAsOpenTicket();

  return (
    <div className="flex items-center justify-between border-b pb-6">
      <h3 className="text-base font-semibold leading-6 text-foreground">
        <span className="text-muted-foreground">#{ticketData?.id}</span>{' '}
        {ticketData?.customer.name}
      </h3>
      <div className="flex items-center gap-x-2">
        {ticketData?.status === TicketStatus.Done ? (
          <Button
            type="button"
            onClick={() => {
              markAsOpenTicket({ id: ticketId });
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
              markAsDoneTicket({ id: ticketId });
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
