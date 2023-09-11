import { FC } from 'react';

import { MessageDirection } from '@cs/database/schema/message';

import { Message } from '~/components/messages/message';
import { MessageAvatar } from '~/components/messages/message-avatar';
import { Contact } from '~/types/Contact';
import { Message as MessageType } from '~/types/Message';
import { cn } from '~/utils/utils';

export type MessageGroupProps = {
  direction: MessageDirection;
  sender: Contact;
  messages: MessageType[];
};

export const MessageGroup: FC<MessageGroupProps> = ({
  direction,
  sender,
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
        <MessageAvatar direction={direction} sender={sender} />
      </div>
    </section>
  );
};
