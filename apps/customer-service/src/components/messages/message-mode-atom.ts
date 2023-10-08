import { atom } from 'jotai';

export const messageModeAtom = atom<'message' | 'comment'>('message');
