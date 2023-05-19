import { Conversation } from '@/hooks/useConversation/Conversation';
import { Message } from '@/hooks/useConversation/Message';
import { User } from '@/hooks/useConversation/User';

export type ConversationState = {
  currentUser?: User;
  conversations: Conversation[];
  activeConversation?: Conversation;
  messagesByConversationId: Map<string, Message[]>;
};
