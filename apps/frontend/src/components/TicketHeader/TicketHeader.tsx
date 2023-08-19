import { FC } from 'react';

import { useTicket } from '~/hooks/useTicket/TicketProvider';

export const TicketHeader: FC = () => {
  const { activeTicket } = useTicket();

  if (!activeTicket) return null;

  return (
    <div className="border-b border-gray-200 pb-5">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        <span className="text-gray-500">#{activeTicket.id}</span>{' '}
        {activeTicket.contact.name}
      </h3>
    </div>
  );
};

TicketHeader.displayName = 'TicketHeader';
