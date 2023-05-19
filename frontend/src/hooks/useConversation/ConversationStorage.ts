import {
  Conversation,
  ConversationId,
} from '@/hooks/useConversation/Conversation';
import { ConversationState } from '@/hooks/useConversation/ConversationState';
import { User } from '@/hooks/useConversation/User';

export class ConversationStorage {
  private currentUser?: User;
  private conversations: Conversation[] = [];
  private activeConversationId?: ConversationId;

  /**
   * Sets current user
   * @param user
   */
  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  /**
   * Checks if conversation exists
   * @param conversationId
   */
  private conversationExists(conversationId: ConversationId) {
    return this.getConversationIdx(conversationId) !== -1;
  }

  /**
   * Gets conversation index in conversations array
   * @param conversationId
   * @returns index of conversation in conversations array or -1 if it doesn't exist
   */
  private getConversationIdx(conversationId: ConversationId) {
    return this.conversations.findIndex((c) => c.id === conversationId);
  }

  /**
   * Gets conversation in conversations array
   * @param conversationId
   * @returns conversation or undefined if it doesn't exist
   */
  getConversation(conversationId: ConversationId) {
    return this.conversations.find((c) => c.id === conversationId);
  }

  /**
   * Adds conversation if it doesn't exist
   * @param conversation
   * @returns true if conversation was added, false if it already exists
   */
  addConversation(conversation: Conversation) {
    const notExists = !this.conversationExists(conversation.id);
    if (notExists) {
      this.conversations.slice().unshift(conversation);
    }

    return notExists;
  }

  /**
   * Removes conversation if it exists
   * @param conversationId
   * @returns true if conversation was removed, false if it doesn't exist
   */
  removeConversation(conversationId: ConversationId) {
    const conversationIdx = this.getConversationIdx(conversationId);

    if (conversationIdx !== -1) {
      this.conversations = this.conversations
        .slice(0, conversationIdx)
        .concat(this.conversations.slice(conversationIdx + 1));

      return true;
    }

    return false;
  }

  /**
   * Sets active conversation
   * @param conversationId
   */
  setActiveConversation(conversationId?: ConversationId) {
    this.activeConversationId = conversationId;
  }

  /**
   * Gets current state
   * @returns current state
   */
  getState(): ConversationState {
    return {
      currentUser: this.currentUser,
      conversations: this.conversations,
      activeConversation: this.activeConversationId
        ? this.getConversation(this.activeConversationId)
        : undefined,
    };
  }
}
