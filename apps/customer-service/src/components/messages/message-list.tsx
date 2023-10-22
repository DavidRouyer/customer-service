import { FC, Fragment } from 'react';

import { MessageGroup } from '~/components/messages/message-group';
import { MessageSeparator } from '~/components/messages/message-separator';
import { ScrollableMessageList } from '~/components/scroll/scrollable-message-list';
import { RelativeDate } from '~/components/ui/relative-date';
import { groupMessagesByDateAndUser } from '~/lib/message';
import { Message as MessageType } from '~/types/Message';

import '~/components/messages/message-list.css';

import { api } from '~/lib/api';

export const MessageList: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: messagesData } = api.message.all.useQuery({
    ticketId: ticketId,
  });

  const groupedMessagesByDate =
    messagesData?.reduce<Record<string, MessageType[]>>((acc, message) => {
      const date = new Date(message.createdAt).toDateString();
      const messages = acc[date] ?? [];

      return {
        ...acc,
        [date]: [...messages, message],
      };
    }, {}) ?? {};

  return (
    <ScrollableMessageList className="relative h-full w-full overflow-hidden py-3">
      {Object.entries(groupedMessagesByDate).map(([date, messages]) => (
        <Fragment key={date}>
          <MessageSeparator>
            <RelativeDate dateTime={new Date(date)} />
          </MessageSeparator>
          {groupMessagesByDateAndUser(messages).map((messages) => (
            <MessageGroup key={messages[0]?.id} messages={messages} />
          ))}
        </Fragment>
      ))}
    </ScrollableMessageList>
  );
};

MessageList.displayName = 'MessageList';
