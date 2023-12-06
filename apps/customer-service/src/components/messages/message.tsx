'use client';

import { FC } from 'react';
import { FormattedDate } from 'react-intl';

import { ChatDirection } from '@cs/lib/chats';

import { MessageContent } from '~/components/messages/message-content';
import { MessageStatus } from '~/components/messages/message-status';
import { cn } from '~/lib/utils';
import { Message as MessageType } from '~/types/Message';

export type MessageProps = {
  message: MessageType;
  type: 'chat' | 'note';
  showStatus?: boolean;
  position?: 'single' | 'first' | 'normal' | 'last';
  children?: React.ReactNode;
};

export const Message: FC<MessageProps> = ({
  message,
  type,
  showStatus = true,
  position = 'single',
  children,
}) => {
  return (
    <section key={message.id} {...{ ['data-message']: '' }}>
      <div
        className={cn(
          'flex items-end',
          message.direction === ChatDirection.Outbound && 'justify-end'
        )}
      >
        <div
          className={cn(
            'order-2 mx-2 flex max-w-xs flex-col space-y-2 text-sm',
            message.direction === ChatDirection.Outbound
              ? 'items-end'
              : 'items-start'
          )}
        >
          <div
            className={cn(
              'inline-block space-y-2 rounded-lg px-4 py-2',
              message.direction === ChatDirection.Outbound
                ? type === 'chat'
                  ? 'bg-blue-600 text-white'
                  : 'bg-warning'
                : 'bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-200',
              (position === 'single' ||
                position === 'first' ||
                position === 'last') &&
                message.direction === ChatDirection.Outbound &&
                'rounded-br-none',
              (position === 'single' || position === 'first') &&
                message.direction === ChatDirection.Inbound &&
                'rounded-bl-none',
              (position === 'normal' || position === 'last') &&
                message.direction === ChatDirection.Outbound &&
                'rounded-r-none',
              (position === 'normal' || position === 'last') &&
                message.direction === ChatDirection.Inbound &&
                'rounded-l-none'
            )}
          >
            <MessageContent
              type={message.contentType}
              content={message.content}
            />
            {showStatus && (
              <div
                className={cn(
                  'flex items-center justify-end gap-x-2 text-xs',
                  message.direction === ChatDirection.Outbound
                    ? 'text-blue-100'
                    : 'text-gray-500'
                )}
              >
                <FormattedDate
                  value={new Date(message.createdAt)}
                  hour="numeric"
                  minute="numeric"
                />
                {message.direction === ChatDirection.Outbound &&
                  type === 'chat' && <MessageStatus status={message.status} />}
              </div>
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
};

Message.displayName = 'Message';
