import { atom } from 'recoil';

export type Message = {
  id: number;
  user: {
    name: string;
    imageUrl: string;
    isAgent: boolean;
  };
  content: string | string[];
  dateTime: string;
};

export const messageListState = atom<Message[]>({
  key: 'MessageList',
  default: [],
});
