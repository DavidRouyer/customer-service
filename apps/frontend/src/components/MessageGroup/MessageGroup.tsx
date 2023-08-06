import { FC } from 'react';

import { Message } from '@/components/Message/Message';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Contact, MessageDirection } from '@/gql/graphql';
import { Message as MessageType } from '@/hooks/useTicket/Message';
import { getInitials } from '@/lib/string';
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
        <Avatar
          className={cn(
            'h-6 w-6 rounded-full',
            direction === MessageDirection.Outbound ? 'order-2' : 'order-1'
          )}
        >
          <AvatarImage
            src={sender.avatarUrl ?? undefined}
            alt={sender.name ?? ''}
          />
          <AvatarFallback className="text-xs">
            {getInitials(sender.name ?? '')}
          </AvatarFallback>
        </Avatar>
      </div>
    </section>
  );
};
