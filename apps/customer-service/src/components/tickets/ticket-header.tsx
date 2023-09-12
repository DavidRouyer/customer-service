import { FC } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { api } from '~/utils/api';
import { getInitials } from '~/utils/string';

export const TicketHeader: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: ticketData } = api.ticket.byId.useQuery({ id: ticketId });

  return (
    <div className="flex justify-between border-b pb-5">
      <h3 className="text-base font-semibold leading-6 text-foreground">
        <span className="text-muted-foreground">#{ticketData?.id}</span>{' '}
        {ticketData?.author.name}
      </h3>
      <>
        {ticketData?.assignedTo && (
          <div className="flex items-center gap-x-2">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={ticketData?.assignedTo?.avatarUrl ?? undefined}
              />
              <AvatarFallback>
                {getInitials(ticketData?.assignedTo?.name ?? '')}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs text-muted-foreground">
              {ticketData?.assignedTo?.name}
            </p>
          </div>
        )}
      </>
    </div>
  );
};

TicketHeader.displayName = 'TicketHeader';
