'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { Session } from '@cs/auth';
import { MessageStatus } from '@cs/database/schema/message';

import { FailedMessageStatus, Message } from '~/hooks/useTicket/Message';
import { Ticket, TicketId } from '~/hooks/useTicket/Ticket';
import { TicketState } from '~/hooks/useTicket/TicketState';
import { TicketStorage } from '~/hooks/useTicket/TicketStorage';
import { User } from '~/hooks/useTicket/User';
import { api } from '~/utils/api';

export type SendMessageParams = {
  message: Omit<Message, 'id'> & { senderId: number };
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
  user?: Session['user'];
};

export const TicketProvider: React.FC<TicketProviderProps> = ({
  children,
  user,
}) => {
  const [storage] = useState<TicketStorage>(new TicketStorage(user));
  const [state, setState] = useState<TicketState>(storage.getState());
  const { mutateAsync: sendRemoteMessage } = api.message.create.useMutation();

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
      const array = new Uint32Array(1);
      const newMessage: Message = {
        ...message,
        id: self.crypto.getRandomValues(array)[0] ?? 0,
      };
      const storedMessage = storage.addMessage(ticketId, newMessage);

      updateState();

      sendRemoteMessage({
        ticketId: ticketId,
        content: storedMessage.content,
        contentType: storedMessage.contentType,
        createdAt: storedMessage.createdAt,
        direction: storedMessage.direction,
        status: storedMessage.status as MessageStatus,
        senderId: storedMessage.sender.id,
      })
        .then((result) => {
          if (!result) {
            return;
          }

          storage.updateMessage(ticketId, storedMessage.id, {
            ...storedMessage,
            id: result?.[0]?.id ?? 0,
            status: MessageStatus.DeliveredToCloud,
          });

          updateState();
        })
        .catch(() => {
          // TODO: Handle error with Tanstack query
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
