import { FC } from 'react';

import { MessageList } from '@/components/MessageList/MessageList';
import { TextEditor } from '@/components/TextEditor/TextEditor';
import { useTicket } from '@/hooks/useTicket/TicketProvider';

export const Component: FC = () => {
  const { activeTicket } = useTicket();

  if (!activeTicket) return null;

  return (
    <div>
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          <span className="text-gray-500">#{activeTicket.id}</span>{' '}
          {activeTicket.contact.name}
        </h3>
      </div>

      <MessageList />
      <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextEditor />
      </div>
    </div>
  );
};

Component.displayName = 'Ticket';
