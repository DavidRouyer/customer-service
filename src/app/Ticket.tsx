import { FC, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { MessageList } from '@/components/MessageList/MessageList';
import { messageListState } from '@/stores/messageList';
import { messagesMock } from '@/stores/messagesMock';
import { Ticket } from '@/stores/ticket';
import { ticketsMock } from '@/stores/ticketsMock';

export const loader = ({ params }: { params: { ticketId?: string } }) => {
  if (!params.ticketId) return null;

  const ticketId = parseInt(params.ticketId, 10);

  if (isNaN(ticketId)) return null;

  return ticketsMock.find((ticket) => ticket.id === ticketId) ?? null;
};

export const Component: FC = () => {
  const ticket = useLoaderData() as Ticket | null;
  const setMessageList = useSetRecoilState(messageListState);
  useEffect(() => {
    if (!ticket) {
      setMessageList([]);
      return;
    }

    const messages = messagesMock.get(ticket.id);

    if (!messages) {
      setMessageList([]);
      return;
    }

    setMessageList(messages);
  }, [ticket, setMessageList]);

  return (
    <div>
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          <span className="text-gray-500">#{ticket?.id}</span>{' '}
          {ticket?.user.name}
        </h3>
      </div>

      <MessageList />
    </div>
  );
};

Component.displayName = 'Ticket';
