import { FC, Fragment } from 'react';

import { MessageGroup } from '~/components/messages/message-group';
import { MessageSeparator } from '~/components/messages/message-separator';
import { ScrollableMessageList } from '~/components/scroll/scrollable-message-list';
import { RelativeDate } from '~/components/ui/relative-date';

import '~/components/messages/message-list.css';

import { api } from '~/lib/api';

export const MessageList: FC<{ ticketId: number }> = ({ ticketId }) => {
  const { data: messagesData } = api.ticket.messagesAndComments.useQuery({
    ticketId: ticketId,
  });

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
