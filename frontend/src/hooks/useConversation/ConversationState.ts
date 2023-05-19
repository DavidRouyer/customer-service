import { Conversation } from '@/hooks/useConversation/Conversation';
import { User } from '@/hooks/useConversation/User';

export type ConversationState = {
  currentUser?: User;
  conversations: Conversation[];
  activeConversation?: Conversation;
};
