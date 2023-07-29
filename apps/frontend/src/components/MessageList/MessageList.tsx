import { FC, Fragment } from 'react';

import { Message } from '@/components/Message/Message';
import { MessageSeparator } from '@/components/MessageSeparator/MessageSeparator';
import { RelativeDate } from '@/components/RelativeDate/RelativeDate';
import { Message as MessageType } from '@/hooks/useTicket/Message';
import { useTicket } from '@/hooks/useTicket/TicketProvider';

export const MessageList: FC = () => {
  const { currentMessages } = useTicket();
  const groupedMessagesByDate = currentMessages.reduce<
    Record<string, MessageType[]>
  >((acc, message) => {
    const date = new Date(message.createdAt).toDateString();
    const messages = acc[date] ?? [];

    return {
      ...acc,
      [date]: [...messages, message],
    };
  }, {});

  return (
    <div
      id="messages"
      className="flex flex-1 flex-col space-y-4 overflow-y-auto p-3"
    >
      {Object.entries(groupedMessagesByDate).map(([date, messages]) => (
        <Fragment key={date}>
          <MessageSeparator>
            <RelativeDate dateTime={new Date(date)} />
          </MessageSeparator>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </Fragment>
      ))}
    </div>
  );
};

MessageList.displayName = 'MessageList';
