'use client';

import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  MessageContentType,
  MessageDirection,
} from '@cs/database/schema/message';

import { MessageStatus } from '~/components/Message/MessageStatus';
import { MessageTextContent } from '~/components/Message/MessageTextContent';
import { Message as MessageType } from '~/hooks/useTicket/Message';
import { formatHours } from '~/utils/date';
import { cn } from '~/utils/utils';

export type MessageProps = {
  message: MessageType;
  showStatus?: boolean;
  position?: 'single' | 'first' | 'normal' | 'last';
  children?: React.ReactNode;
};

export const Message: FC<MessageProps> = ({
  message,
  showStatus = true,
  position = 'single',
  children,
}) => {
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
          <div
            className={cn(
              'inline-block space-y-2 rounded-lg px-4 py-2',
              message.direction === MessageDirection.Outbound
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-600',
              (position === 'single' ||
                position === 'first' ||
                position === 'last') &&
                message.direction === MessageDirection.Outbound &&
                'rounded-br-none',
              (position === 'single' || position === 'first') &&
                message.direction === MessageDirection.Inbound &&
                'rounded-bl-none',
              (position === 'normal' || position === 'last') &&
                message.direction === MessageDirection.Outbound &&
                'rounded-r-none',
              (position === 'normal' || position === 'last') &&
                message.direction === MessageDirection.Inbound &&
                'rounded-l-none'
            )}
          >
            {messageContent}
            {showStatus && (
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
            )}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
};

Message.displayName = 'Message';
