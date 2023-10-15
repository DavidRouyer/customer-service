import { FC } from 'react';
import { BookOpenCheck, HardDriveUpload } from 'lucide-react';
import { FormattedMessage } from 'react-intl';

import { TicketStatus } from '@cs/lib/tickets';

import { Button } from '~/components/ui/button';
import { useReopenTicket } from '~/hooks/useReopenTicket';
import { useResolveTicket } from '~/hooks/useResolveTicket';
import { api } from '~/lib/api';

export const TicketHeader: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({ id: ticketId });

  const { resolveTicket } = useResolveTicket();
  const { reopenTicket } = useReopenTicket();

  return (
    <div className="flex items-center justify-between border-b pb-6">
      <h3 className="text-base font-semibold leading-6 text-foreground">
        <span className="text-muted-foreground">#{ticketData?.id}</span>{' '}
        {ticketData?.author.name}
      </h3>
      <div className="flex items-center gap-x-2">
        {ticketData?.status === TicketStatus.Resolved ? (
          <Button
            type="button"
            onClick={() => {
              reopenTicket({ id: ticketId });
            }}
            className="flex items-center gap-x-1"
          >
            <HardDriveUpload className="h-4 w-4" />
            <FormattedMessage id="ticket.actions.reopen" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => {
              resolveTicket({ id: ticketId });
            }}
            className="flex items-center gap-x-1"
          >
            <BookOpenCheck className="h-4 w-4" />
            <FormattedMessage id="ticket.actions.resolve" />
          </Button>
        )}
      </div>
    </div>
  );
};

TicketHeader.displayName = 'TicketHeader';
