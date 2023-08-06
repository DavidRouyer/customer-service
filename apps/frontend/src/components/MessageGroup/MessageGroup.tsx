import { FC } from 'react';

import { Message } from '@/components/Message/Message';
import { MessageAvatar } from '@/components/Message/MessageAvatar';
import { Contact, MessageDirection } from '@/gql/graphql';
import { Message as MessageType } from '@/hooks/useTicket/Message';
import { cn } from '@/lib/utils';

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
