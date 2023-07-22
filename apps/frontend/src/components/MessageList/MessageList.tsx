import { FC, useMemo } from 'react';

import { MessageListItem } from '@/components/MessageList/MessageListItem';
import { MessageSeparator } from '@/components/MessageSeparator/MessageSeparator';
import { Message } from '@/hooks/useTicket/Message';
import { useTicket } from '@/hooks/useTicket/TicketProvider';

export const MessageList: FC = () => {
  const { currentMessages } = useTicket();
  const groupedMessagesByDate = useMemo(
    () =>
      currentMessages.reduce<Record<string, Message[]>>((acc, message) => {
        const date = new Date(message.createdAt).toLocaleDateString();
        const messages = acc[date] ?? [];

        return {
          ...acc,
          [date]: [...messages, message],
        };
      }, {}),
    [currentMessages]
  );

  return (
    <div
      id="messages"
      className="flex flex-1 flex-col space-y-4 overflow-y-auto p-3"
    >
      {Object.entries(groupedMessagesByDate).map(([date, messages]) => (
        <>
          <MessageSeparator>{date}</MessageSeparator>
          {messages.map((message) => (
            <MessageListItem key={message.id} message={message} />
          ))}
        </>
      ))}
    </div>
  );
};

MessageList.displayName = 'MessageList';
