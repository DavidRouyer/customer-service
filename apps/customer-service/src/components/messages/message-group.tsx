import { FC } from 'react';

import { RouterOutputs } from '@cs/api';
import { MessageDirection } from '@cs/lib/messages';

import { Message } from '~/components/messages/message';
import { MessageAvatar } from '~/components/messages/message-avatar';
import { cn } from '~/lib/utils';

export type MessageGroupProps = {
  messages: RouterOutputs['ticket']['conversation'][0][];
};

export const MessageGroup: FC<MessageGroupProps> = ({ messages }) => {
  if (messages.length === 0 || !messages[0]) {
    return null;
  }

  const firstMessage = messages[0];

  if (messages.length === 1) {
    return (
      <Message message={firstMessage} type={firstMessage.type}>
        <MessageAvatar
          direction={firstMessage.direction}
          createdBy={firstMessage.createdBy}
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
              type={firstMessage.type}
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
          createdBy={firstMessage.createdBy}
        />
      </div>
    </section>
  );
};
