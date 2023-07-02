import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { Agent, agentListState } from '@/stores/agentList';

const initialAgentList: Agent[] = [
  {
    id: 1,
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
  },
  {
    id: 2,
    name: 'Meriadoc Brandybuck',
    email: 'meriadoc.brandybuck@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
  },
  {
    id: 3,
    name: 'Frodo Baggins',
    email: 'frodo.baggins@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
  },
  {
    id: 4,
    name: 'Samwise Gamgee',
    email: 'samwise.gamgee@example.com',
    avatarUrl:
      'https://images.unsplash.com/photo-1513910367299-bce8d8a0ebf6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
  },
];

export const useSetupAgentList = () => {
  const setAgentList = useSetRecoilState(agentListState);
  useEffect(() => {
    setAgentList(initialAgentList);
  }, [setAgentList]);
};
