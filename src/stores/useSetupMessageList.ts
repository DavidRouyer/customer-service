import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { Message, messageListState } from '@/stores/messageList';

const initialMessageList: Message[] = [
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

export const useSetupMessageList = () => {
  const setMessageList = useSetRecoilState(messageListState);
  useEffect(() => {
    setMessageList(initialMessageList);
  }, [setMessageList]);
};
