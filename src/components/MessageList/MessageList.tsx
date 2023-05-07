import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { cn } from '@/lib/utils';
import { messageListState } from '@/stores/messageList';

export const MessageList: FC = () => {
  const messageList = useRecoilValue(messageListState);

  return (
    <div id="messages" className="flex flex-col space-y-4 overflow-y-auto p-3">
      {messageList.map((message) => (
        <div key={message.id}>
          <div
            className={cn(
              'flex items-end',
              !message.user.isAgent && 'justify-end'
            )}
          >
            <div
              className={cn(
                'order-2 mx-2 flex max-w-xs flex-col space-y-2 text-sm',
                message.user.isAgent ? 'items-start' : 'items-end'
              )}
            >
              {typeof message.content === 'string' && (
                <div>
                  <span
                    className={cn(
                      'inline-block rounded-lg px-4 py-2',
                      message.user.isAgent
                        ? 'rounded-bl-none bg-gray-300 text-gray-600'
                        : 'rounded-br-none bg-blue-600 text-white'
                    )}
                  >
                    {message.content}
                  </span>
                </div>
              )}
              {typeof message.content !== 'string' &&
                message.content.map((content, index) => (
                  <div key={content}>
                    <span
                      className={cn(
                        'inline-block rounded-lg px-4 py-2',
                        message.user.isAgent
                          ? 'bg-gray-300 text-gray-600'
                          : 'bg-blue-600 text-white',
                        message.user.isAgent &&
                          index === message.content.length - 1 &&
                          'rounded-bl-none',
                        !message.user.isAgent &&
                          index === message.content.length - 1 &&
                          'rounded-br-none'
                      )}
                    >
                      {content}
                    </span>
                  </div>
                ))}
            </div>
            <img
              src={message.user.imageUrl}
              alt={message.user.name}
              className={cn(
                'h-6 w-6 rounded-full',
                message.user.isAgent ? 'order-1' : 'order-2'
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

MessageList.displayName = 'MessageList';
