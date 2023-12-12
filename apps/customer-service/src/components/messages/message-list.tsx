'use client';

import { FC, Fragment } from 'react';

import { MessageGroup } from '~/components/messages/message-group';
import { MessageSeparator } from '~/components/messages/message-separator';
import { ScrollableMessageList } from '~/components/scroll/scrollable-message-list';
import { RelativeDate } from '~/components/ui/relative-date';

import '~/components/messages/message-list.css';

import { api, RouterOutputs } from '~/lib/api';
import { TimelineByDay } from '~/types/Conversation';

const getConversation = (messages: RouterOutputs['ticket']['timeline']) => {
  return messages?.reduce<TimelineByDay>((acc, message) => {
    const date = new Date(message.createdAt);
    const dateAsString = date.toISOString().substring(0, 10);
    date.setUTCMilliseconds(0);
    date.setUTCSeconds(0);
    const idx = `${date.toISOString()}.${message.createdBy.id}`;

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

export const MessageList: FC<{ ticketId: string }> = ({ ticketId }) => {
  const { data: messagesData } = api.ticketTimeline.byTicketId.useQuery(
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
