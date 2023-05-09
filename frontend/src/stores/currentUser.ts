import { atom } from 'recoil';

export type User = {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
};

export const currentUserState = atom<User | undefined>({
  key: 'CurrentUser',
  default: undefined,
});
