import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { MessageStatus } from '@/gql/graphql';
import { useAddMessage } from '@/hooks/useAddMessage';
import { FailedMessageStatus, Message } from '@/hooks/useTicket/Message';
import { Ticket, TicketId } from '@/hooks/useTicket/Ticket';
import { TicketState } from '@/hooks/useTicket/TicketState';
import { TicketStorage } from '@/hooks/useTicket/TicketStorage';
import { User } from '@/hooks/useTicket/User';

export type SendMessageParams = {
  message: Omit<Message, 'id'>;
  ticketId: TicketId;
};

export type TicketContextType = TicketState & {
  setCurrentUser: (user: User) => void;
  addTicket: (ticket: Ticket) => void;
  removeTicket: (ticketId: TicketId) => boolean;
  getTicket: (ticketId: TicketId) => Ticket | undefined;
  setActiveTicket: (ticketId: TicketId) => void;
  addMessage: (ticketId: TicketId, message: Message) => void;
  sendMessage: (params: SendMessageParams) => void;
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
  const { trigger: sendRemoteMessage } = useAddMessage();

  const updateState = useCallback(() => {
    const newState = storage.getState();
    setState(newState);
  }, [setState, storage]);

  const setCurrentUser = useCallback(
    (user: User): void => {
      storage.setCurrentUser(user);

      updateState();
    },
    [storage, updateState]
  );

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
    ({ message, ticketId }: SendMessageParams) => {
      const newMessage: Message = {
        ...message,
        id: self.crypto.randomUUID(),
      };
      const storedMessage = storage.addMessage(ticketId, newMessage);

      updateState();

      sendRemoteMessage({
        ticketId: ticketId,
        message: {
          content: storedMessage.content,
          contentType: storedMessage.contentType,
          createdAt: storedMessage.createdAt,
          direction: storedMessage.direction,
          status: storedMessage.status as MessageStatus,
          senderId: storedMessage.sender.id,
        },
      })
        .then((result) => {
          if (!result?.data?.addMessage) {
            return;
          }

          storage.updateMessage(ticketId, storedMessage.id, {
            ...storedMessage,
            id: result.data.addMessage,
            status: MessageStatus.DeliveredToCloud,
          });

          updateState();
        })
        .catch(() => {
          storage.updateMessage(ticketId, storedMessage.id, {
            ...storedMessage,
            status: FailedMessageStatus.Failed,
          });

          updateState();
        });
    },
    [sendRemoteMessage, storage, updateState]
  );

  const contextValue = useMemo<TicketContextType>(() => {
    return {
      addMessage,
      addTicket: addTicket,
      getTicket: getTicket,
      removeTicket: removeTicket,
      sendMessage: sendMessage,
      setActiveTicket: setActiveTicket,
      setCurrentUser: setCurrentUser,
      ...state,
    };
  }, [
    addMessage,
    addTicket,
    getTicket,
    removeTicket,
    sendMessage,
    setActiveTicket,
    setCurrentUser,
    state,
  ]);

  return (
    <TicketContext.Provider value={contextValue}>
      {children}
    </TicketContext.Provider>
  );
};

TicketProvider.displayName = 'TicketProvider';
