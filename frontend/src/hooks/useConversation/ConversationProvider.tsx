import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  Conversation,
  ConversationId,
} from '@/hooks/useConversation/Conversation';
import { ConversationState } from '@/hooks/useConversation/ConversationState';
import { ConversationStorage } from '@/hooks/useConversation/ConversationStorage';
import { Message } from '@/hooks/useConversation/Message';

export type ConversationContextType = ConversationState & {
  currentMessages: Message[];
  addConversation: (conversation: Conversation) => void;
  removeConversation: (conversationId: ConversationId) => boolean;
  getConversation: (conversationId: ConversationId) => Conversation | undefined;
  setActiveConversation: (conversationId: ConversationId) => void;
  addMessage: (conversationId: ConversationId, message: Message) => void;
};

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

ConversationContext.displayName = 'ConversationContext';

export const useConversation = () => {
  const context = useContext(ConversationContext);

  if (!context) {
    throw new Error(
      'useConversation must be used within a ConversationProvider'
    );
  }

  return context;
};

export type ConversationProviderProps = {
  children: React.ReactNode;
};

export const ConversationProvider: React.FC<ConversationProviderProps> = ({
  children,
}) => {
  const [storage] = useState<ConversationStorage>(new ConversationStorage());
  const [state, setState] = useState<ConversationState>(storage.getState());

  const updateState = useCallback(() => {
    const newState = storage.getState();
    setState(newState);
  }, [setState, storage]);

  const addConversation = useCallback(
    (conversation: Conversation) => {
      storage.addConversation(conversation);
      updateState();
    },
    [storage, updateState]
  );

  const removeConversation = useCallback(
    (conversationId: ConversationId) => {
      const result = storage.removeConversation(conversationId);
      updateState();
      return result;
    },
    [storage, updateState]
  );

  const getConversation = useCallback(
    (conversationId: ConversationId) => storage.getConversation(conversationId),
    [storage]
  );

  const setActiveConversation = useCallback(
    (conversationId?: ConversationId) => {
      storage.setActiveConversation(conversationId);
      updateState();
    },
    [storage, updateState]
  );

  const addMessage = useCallback(
    (conversationId: ConversationId, message: Message) => {
      storage.addMessage(conversationId, message);
      updateState();
    },
    [storage, updateState]
  );

  const contextValue = useMemo<ConversationContextType>(
    () => ({
      addConversation,
      addMessage,
      currentMessages:
        state.activeConversation &&
        state.messagesByConversationId.has(state.activeConversation.id)
          ? (state.messagesByConversationId.get(
              state.activeConversation.id
            ) as Message[])
          : [],
      removeConversation,
      getConversation,
      setActiveConversation,
      ...state,
    }),
    [
      addConversation,
      addMessage,
      getConversation,
      removeConversation,
      setActiveConversation,
      state,
    ]
  );

  return (
    <ConversationContext.Provider value={contextValue}>
      {children}
    </ConversationContext.Provider>
  );
};

ConversationProvider.displayName = 'ConversationProvider';
