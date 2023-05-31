import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { Message } from '@/hooks/useTicket/Message';
import { Ticket, TicketId } from '@/hooks/useTicket/Ticket';
import { TicketState } from '@/hooks/useTicket/TicketState';
import { TicketStorage } from '@/hooks/useTicket/TicketStorage';

export interface SendMessageParams {
  message: Message;
  ticketId: TicketId;
  senderId: string;
}

export type TicketContextType = TicketState & {
  currentMessages: Message[];
  addTicket: (ticket: Ticket) => void;
  removeTicket: (ticketId: TicketId) => boolean;
  getTicket: (ticketId: TicketId) => Ticket | undefined;
  setActiveTicket: (ticketId: TicketId) => void;
  addMessage: (ticketId: TicketId, message: Message) => void;
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

TicketContext.displayName = 'TicketContext';

export const useTicket = () => {
  const context = useContext(TicketContext);

  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }

  return context;
};

export type TicketProviderProps = {
  children: React.ReactNode;
};

export const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [storage] = useState<TicketStorage>(new TicketStorage());
  const [state, setState] = useState<TicketState>(storage.getState());

  const updateState = useCallback(() => {
    const newState = storage.getState();
    setState(newState);
  }, [setState, storage]);

  const addTicket = useCallback(
    (ticket: Ticket) => {
      storage.addTicket(ticket);
      updateState();
    },
    [storage, updateState]
  );

  const removeTicket = useCallback(
    (ticketId: TicketId) => {
      const result = storage.removeTicket(ticketId);
      updateState();
      return result;
    },
    [storage, updateState]
  );

  const getTicket = useCallback(
    (ticketId: TicketId) => storage.getTicket(ticketId),
    [storage]
  );

  const setActiveTicket = useCallback(
    (ticketId?: TicketId) => {
      storage.setActiveTicket(ticketId);
      updateState();
    },
    [storage, updateState]
  );

  const addMessage = useCallback(
    (ticketId: TicketId, message: Message) => {
      storage.addMessage(ticketId, message);
      updateState();
    },
    [storage, updateState]
  );

  const sendMessage = useCallback(
    ({ message, senderId, ticketId }: SendMessageParams) => {
      const storedMessage = storage.addMessage(ticketId, message);

      updateState();

      const messageEvent = new CustomEvent('chat-protocol', {
        detail: {
          type: 'message',
          storedMessage,
          ticketId,
          sender: senderId,
        },
      });

      window.dispatchEvent(messageEvent);
    },
    [storage]
  );

  const contextValue = useMemo<TicketContextType>(
    () => ({
      addTicket: addTicket,
      addMessage,
      currentMessages:
        state.activeTicket &&
        state.messagesByTicketId.has(state.activeTicket.id)
          ? (state.messagesByTicketId.get(state.activeTicket.id) as Message[])
          : [],
      removeTicket: removeTicket,
      getTicket: getTicket,
      setActiveTicket: setActiveTicket,
      ...state,
    }),
    [addTicket, addMessage, getTicket, removeTicket, setActiveTicket, state]
  );

  return (
    <TicketContext.Provider value={contextValue}>
      {children}
    </TicketContext.Provider>
  );
};

TicketProvider.displayName = 'TicketProvider';
