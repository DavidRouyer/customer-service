import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { MessageStatus } from '@/components/Message/MessageStatus';
import { MessageTextContent } from '@/components/Message/MessageTextContent';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { MessageContentType, MessageDirection } from '@/gql/graphql';
import { Message as MessageType } from '@/hooks/useTicket/Message';
import { formatHours } from '@/lib/date';
import { getInitials } from '@/lib/string';
import { cn } from '@/lib/utils';

export type MessageProps = {
  message: MessageType;
};

export const Message: FC<MessageProps> = ({ message }) => {
  const { i18n } = useTranslation();

  const messageContent = (() => {
    if (message.contentType === MessageContentType.TextPlain)
      return <MessageTextContent text={message.content} />;
    return null;
  })();

  return (
    <section key={message.id} {...{ ['data-message']: '' }}>
      <div
        className={cn(
          'flex items-end',
          message.direction === MessageDirection.Outbound && 'justify-end'
        )}
      >
        <div
          className={cn(
            'order-2 mx-2 flex max-w-xs flex-col space-y-2 text-sm',
            message.direction === MessageDirection.Outbound
              ? 'items-end'
              : 'items-start'
          )}
        >
          <div>
            <span
              className={cn(
                'inline-block rounded-lg space-y-2 px-4 py-2',
                message.direction === MessageDirection.Outbound
                  ? 'rounded-br-none bg-blue-600 text-white'
                  : 'rounded-bl-none bg-gray-300 text-gray-600'
              )}
            >
              <div>{messageContent}</div>
              <div
                className={cn(
                  'flex items-center justify-end gap-x-2 text-xs',
                  message.direction === MessageDirection.Outbound
                    ? 'text-blue-100'
                    : 'text-gray-500'
                )}
              >
                {formatHours(new Date(message.createdAt), i18n.language)}
                {message.direction === MessageDirection.Outbound && (
                  <MessageStatus status={message.status} />
                )}
              </div>
            </span>
          </div>
        </div>
        <Avatar
          className={cn(
            'h-6 w-6 rounded-full',
            message.direction === MessageDirection.Outbound
              ? 'order-2'
              : 'order-1'
          )}
        >
          <AvatarImage
            src={message.sender.avatarUrl ?? undefined}
            alt={message.sender.name ?? ''}
          />
          <AvatarFallback className="text-xs">
            {getInitials(message.sender.name ?? '')}
          </AvatarFallback>
        </Avatar>
      </div>
    </section>
  );
};

Message.displayName = 'Message';
