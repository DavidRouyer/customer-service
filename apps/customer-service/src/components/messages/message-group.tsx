import { FC } from 'react';

import { MessageDirection } from '@cs/lib/messages';

import { Message } from '~/components/messages/message';
import { MessageAvatar } from '~/components/messages/message-avatar';
import { cn } from '~/lib/utils';
import { Message as MessageType } from '~/types/Message';

export type MessageGroupProps = {
  messages: MessageType[];
};

export const MessageGroup: FC<MessageGroupProps> = ({ messages }) => {
  if (messages.length === 0 || !messages[0]) {
    return null;
  }

  const firstMessage = messages[0];

  if (messages.length === 1) {
    return (
      <Message message={firstMessage}>
        <MessageAvatar
          direction={firstMessage.direction}
          author={firstMessage.author}
        />
      </Message>
    );
  }

  return (
    <section {...{ ['data-message-group']: '' }}>
      <div
        className={cn(
          'flex items-end',
          firstMessage.direction === MessageDirection.Outbound && 'justify-end'
        )}
      >
        <div className="space-y-1">
          {messages.map((message, idx) => (
            <Message
              key={message.id}
              message={message}
              showStatus={idx === messages.length - 1}
              position={
                idx === 0
                  ? 'first'
                  : idx === messages.length - 1
                  ? 'last'
                  : 'normal'
              }
            />
          ))}
        </div>
        <MessageAvatar
          direction={firstMessage.direction}
          author={firstMessage.author}
        />
      </div>
    </section>
  );
};
