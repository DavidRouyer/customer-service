import { FC, Fragment } from 'react';

import { Message } from '~/components/Message/Message';
import { MessageAvatar } from '~/components/Message/MessageAvatar';
import { MessageGroup } from '~/components/MessageGroup/MessageGroup';
import { MessageSeparator } from '~/components/MessageSeparator/MessageSeparator';
import { RelativeDate } from '~/components/RelativeDate/RelativeDate';
import { ScrollableMessageList } from '~/components/Scroll/ScrollableMessageList';
import { Message as MessageType } from '~/hooks/useTicket/Message';
import { useTicket } from '~/hooks/useTicket/TicketProvider';
import { groupMessagesByDateAndUser } from '~/lib/message';

import '~/components/MessageList/message-list.css';

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
    <ScrollableMessageList className="relative h-full w-full overflow-hidden py-3">
      {Object.entries(groupedMessagesByDate).map(([date, messages]) => (
        <Fragment key={date}>
          <MessageSeparator>
            <RelativeDate dateTime={new Date(date)} />
          </MessageSeparator>
          {groupMessagesByDateAndUser(messages).map((messages) =>
            messages.length === 1 ? (
              <Message key={messages[0].id} message={messages[0]}>
                <MessageAvatar
                  direction={messages[0].direction}
                  sender={messages[0].sender}
                />
              </Message>
            ) : (
              <MessageGroup
                key={messages[0].id}
                direction={messages[0].direction}
                sender={messages[0].sender}
                messages={messages}
              />
            )
          )}
        </Fragment>
      ))}
    </ScrollableMessageList>
  );
};

MessageList.displayName = 'MessageList';
