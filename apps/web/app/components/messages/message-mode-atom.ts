import { atom } from 'jotai';

export const messageModeAtom = atom<'reply' | 'note'>('reply');
