import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { User, currentUserState } from '@/stores/currentUser';

const initialCurrentUser: User = {
  id: 1,
  name: 'Tom Cook',
  email: 'tom.cook@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=144&h=144&q=80',
};

export const useSetupCurrentUser = () => {
  const setCurrentUser = useSetRecoilState(currentUserState);
  useEffect(() => {
    setCurrentUser(initialCurrentUser);
  }, [setCurrentUser]);
};
