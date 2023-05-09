import { Message } from '@/stores/messageList';

export const messagesMock = new Map<number, Message[]>();
messagesMock.set(1, [
  {
    id: 1,
    user: {
      name: 'Leslie Alexander',
      imageUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
      isAgent: false,
    },
    content:
      'Your error message says permission denied, npm global installs must be given root privileges.',
    dateTime: '2020-12-09T12:34:00',
  },
  {
    id: 2,
    user: {
      name: 'Tom Cook',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
      isAgent: true,
    },
    content: 'Can be verified on any platform using docker',
    dateTime: '2020-12-09T12:34:00',
  },
  {
    id: 3,
    user: {
      name: 'Tom Cook',
      imageUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
      isAgent: true,
    },
    content: [
      "Command was run with root privileges. I'm sure about that.",
      "I've update the description so it's more obviously now",
      'FYI https://askubuntu.com/a/700266/510172',
      "Check the line above (it ends with a # so, I'm running it as\nroot )<pre># npm install -g @vue/devtools</pre>",
    ],
    dateTime: '2020-12-09T12:34:00',
  },
]);
messagesMock.set(2, [
  {
    id: 1,
    user: {
      name: 'Michael Foster',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
      isAgent: false,
    },
    content:
      'Your error message says permission denied, npm global installs must be given root privileges.',
    dateTime: '2020-12-09T12:34:00',
  },
]);
