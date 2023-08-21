import { atom } from 'recoil';

export type Agent = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
};

export const agentListState = atom<Agent[]>({
  key: 'AgentList',
  default: [],
});
