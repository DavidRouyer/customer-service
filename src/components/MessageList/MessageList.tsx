import { FC } from 'react';

import { cn } from '@/lib/utils';

export type Message = {
  id: number;
  user: {
    name: string;
    imageUrl: string;
  };
  content: string | string[];
  dateTime: string;
};

const messages: Message[] = [
  {
    id: 1,
    user: {
      name: 'Tom Cook',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
    },
    content: 'Can be verified on any platform using docker',
    dateTime: '2020-12-09T12:34:00',
  },
  {
    id: 2,
    user: {
      name: 'John Doe',
      imageUrl:
        'https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144',
    },
    content:
      'Your error message says permission denied, npm global installs must be given root privileges.',
    dateTime: '2020-12-09T12:34:00',
  },
  {
    id: 3,
    user: {
      name: 'Tom Cook',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
    },
    content: [
      "Command was run with root privileges. I'm sure about that.",
      "I've update the description so it's more obviously now",
      'FYI https://askubuntu.com/a/700266/510172',
      "Check the line above (it ends with a # so, I'm running it as\nroot )<pre># npm install -g @vue/devtools</pre>",
    ],
    dateTime: '2020-12-09T12:34:00',
  },
];

export const MessageList: FC = () => {
  return (
    <div id="messages" className="flex flex-col space-y-4 overflow-y-auto p-3">
      {messages.map((message) => (
        <div key={message.id}>
          <div
            className={cn(
              'flex items-end',
              message.user.name !== 'Tom Cook' && 'justify-end'
            )}
          >
            <div
              className={cn(
                'order-2 mx-2 flex max-w-xs flex-col space-y-2 text-sm',
                message.user.name === 'Tom Cook' && 'items-start',
                message.user.name !== 'Tom Cook' && 'items-end'
              )}
            >
              {typeof message.content === 'string' && (
                <div>
                  <span
                    className={cn(
                      'inline-block rounded-lg px-4 py-2',
                      message.user.name === 'Tom Cook' &&
                        'rounded-bl-none bg-gray-300 text-gray-600',
                      message.user.name !== 'Tom Cook' &&
                        'rounded-br-none bg-blue-600 text-white'
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
                        message.user.name === 'Tom Cook' &&
                          'bg-gray-300 text-gray-600',
                        message.user.name !== 'Tom Cook' &&
                          'bg-blue-600 text-white',
                        message.user.name === 'Tom Cook' &&
                          index === message.content.length - 1 &&
                          'rounded-bl-none',
                        message.user.name !== 'Tom Cook' &&
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
                message.user.name === 'Tom Cook' && 'order-1',
                message.user.name !== 'Tom Cook' && 'order-2'
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

MessageList.displayName = 'MessageList';
