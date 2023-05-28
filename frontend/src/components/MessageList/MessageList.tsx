import { FC } from 'react';

import { MessageDirection } from '@/gql/graphql';
import { useTicket } from '@/hooks/useTicket/TicketProvider';
import { cn } from '@/lib/utils';

export const MessageList: FC = () => {
  const { currentMessages } = useTicket();

  return (
    <div
      id="messages"
      className="flex flex-1 flex-col space-y-4 overflow-y-auto p-3"
    >
      {currentMessages.map((message) => (
        <div key={message.id}>
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
              {typeof message.content === 'string' && (
                <div>
                  <span
                    className={cn(
                      'inline-block rounded-lg px-4 py-2',
                      message.direction === MessageDirection.Outbound
                        ? 'rounded-br-none bg-blue-600 text-white'
                        : 'rounded-bl-none bg-gray-300 text-gray-600'
                    )}
                  >
                    {message.content}
                  </span>
                </div>
              )}
            </div>
            <img
              src={message.sender.imageUrl ?? undefined}
              alt={message.sender.name ?? undefined}
              className={cn(
                'h-6 w-6 rounded-full',
                message.direction === MessageDirection.Outbound
                  ? 'order-2'
                  : 'order-1'
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

MessageList.displayName = 'MessageList';
