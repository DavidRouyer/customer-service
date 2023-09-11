import { FC } from 'react';

import { api } from '~/utils/api';

export const TicketHeader: FC<{ id: number }> = ({ id }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({ id: id });

  return (
    <div className="border-b pb-5">
      <h3 className="text-base font-semibold leading-6 text-foreground">
        <span className="text-muted-foreground">#{ticketData?.id}</span>{' '}
        {ticketData?.contact.name}
      </h3>
    </div>
  );
};

TicketHeader.displayName = 'TicketHeader';
