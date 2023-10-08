import { FC } from 'react';

import { MessageDirection } from '@cs/database/schema/message';

import { Message } from '~/components/messages/message';
import { MessageAvatar } from '~/components/messages/message-avatar';
import { Contact } from '~/types/Contact';
import { Message as MessageType } from '~/types/Message';
import { cn } from '~/utils/utils';

export type MessageGroupProps = {
  direction: MessageDirection;
  author: Contact;
  messages: MessageType[];
};

export const MessageGroup: FC<MessageGroupProps> = ({
  direction,
  author,
  messages,
}) => {
  return (
    <section {...{ ['data-message-group']: '' }}>
      <div
        className={cn(
          'flex items-end',
          direction === MessageDirection.Outbound && 'justify-end'
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
        <MessageAvatar direction={direction} author={author} />
      </div>
    </section>
  );
};
