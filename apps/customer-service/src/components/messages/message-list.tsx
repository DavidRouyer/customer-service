'use client';

import { FC, Fragment } from 'react';

import { MessageGroup } from '~/components/messages/message-group';
import { MessageSeparator } from '~/components/messages/message-separator';
import { ScrollableMessageList } from '~/components/scroll/scrollable-message-list';
import { RelativeDate } from '~/components/ui/relative-date';

import '~/components/messages/message-list.css';

import { api, RouterOutputs } from '~/lib/api';
import { Conversation } from '~/types/Conversation';

const getConversation = (messages: RouterOutputs['ticket']['conversation']) => {
  return messages?.reduce<Conversation>((acc, message) => {
    const date = new Date(message.createdAt);
    const dateAsString = date.toDateString();
    date.setUTCMilliseconds(0);
    date.setUTCSeconds(0);
    const idx = `${date.toISOString()}.${message.author.id}`;

    if (acc[dateAsString]) {
      acc = {
        ...acc,
        [dateAsString]: {
          ...acc[dateAsString],
          [idx]: [...(acc[dateAsString]?.[idx] ?? []), message],
        },
      };
    } else {
      acc = {
        ...acc,
        [dateAsString]: {
          [idx]: [message],
        },
      };
    }
    return acc;
  }, {});
};

export const MessageList: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: messagesData } = api.ticket.conversation.useQuery(
    {
      ticketId: ticketId,
    },
    {
      select: getConversation,
    }
  );

  return (
    <ScrollableMessageList className="relative h-full w-full overflow-hidden py-3">
      {Object.entries(messagesData ?? {}).map(([date, messageGroups]) => (
        <Fragment key={date}>
          <MessageSeparator>
            <RelativeDate dateTime={new Date(date)} />
          </MessageSeparator>
          {Object.entries(messageGroups).map(([key, messages]) => (
            <MessageGroup key={key} messages={messages} />
          ))}
        </Fragment>
      ))}
    </ScrollableMessageList>
  );
};

MessageList.displayName = 'MessageList';
