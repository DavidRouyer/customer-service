import { FC, Fragment } from 'react';

import { Message } from '@/components/Message/Message';
import { MessageGroup } from '@/components/MessageGroup/MessageGroup';
import { MessageSeparator } from '@/components/MessageSeparator/MessageSeparator';
import { RelativeDate } from '@/components/RelativeDate/RelativeDate';
import { ScrollableMessageList } from '@/components/Scroll/ScrollableMessageList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { MessageDirection } from '@/gql/graphql';
import { Message as MessageType } from '@/hooks/useTicket/Message';
import { useTicket } from '@/hooks/useTicket/TicketProvider';
import { getInitials } from '@/lib/string';
import { cn } from '@/lib/utils';

import '@/components/MessageList/message-list.css';

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

  const groupMessagesByStatusAndDate = (messages: MessageType[]) => {
    const groupedMessages = messages.reduce<Record<string, MessageType[]>>(
      (acc, message) => {
        const date = new Date(message.createdAt);
        date.setUTCMilliseconds(0);
        date.setUTCSeconds(0);
        const dateStr = date.toISOString();
        const messages = acc[dateStr] ?? [];

        return {
          ...acc,
          [dateStr]: [...messages, message],
        };
      },
      {}
    );

    return Object.values(groupedMessages);
  };

  return (
    <ScrollableMessageList className="relative h-full w-full overflow-hidden py-3">
      {Object.entries(groupedMessagesByDate).map(([date, messages]) => (
        <Fragment key={date}>
          <MessageSeparator>
            <RelativeDate dateTime={new Date(date)} />
          </MessageSeparator>
          {groupMessagesByStatusAndDate(messages).map((messages) => {
            if (messages.length === 1)
              return (
                <Message key={messages[0].id} message={messages[0]}>
                  <Avatar
                    className={cn(
                      'h-6 w-6 rounded-full',
                      messages[0].direction === MessageDirection.Outbound
                        ? 'order-2'
                        : 'order-1'
                    )}
                  >
                    <AvatarImage
                      src={messages[0].sender.avatarUrl ?? undefined}
                      alt={messages[0].sender.name ?? ''}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(messages[0].sender.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                </Message>
              );

            return (
              <MessageGroup
                key={messages[0].id}
                direction={messages[0].direction}
                sender={messages[0].sender}
                messages={messages}
              />
            );
          })}
        </Fragment>
      ))}
    </ScrollableMessageList>
  );
};

MessageList.displayName = 'MessageList';
