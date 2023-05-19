import {
  Conversation,
  ConversationId,
} from '@/hooks/useConversation/Conversation';
import { ConversationState } from '@/hooks/useConversation/ConversationState';
import { Message } from '@/hooks/useConversation/Message';
import { User } from '@/hooks/useConversation/User';

export class ConversationStorage {
  private currentUser?: User;
  private conversations: Conversation[] = [];
  private activeConversationId?: ConversationId;
  private messagesByConversationId: Map<string, Message[]> = new Map();

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
      this.conversations.unshift(conversation);
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

      if (this.messagesByConversationId.has(conversationId)) {
        this.messagesByConversationId.delete(conversationId);
      }

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
   * Adds message to conversation
   * @param conversationId
   * @param message
   * @returns added message
   */
  addMessage(conversationId: ConversationId, message: Message) {
    if (!this.messagesByConversationId.has(conversationId)) {
      this.messagesByConversationId.set(conversationId, [message]);

      return message;
    }

    // TODO: refactor
    const newMessage = { ...message, id: Date.now() };
    const messages = this.messagesByConversationId.get(conversationId);
    messages?.push(newMessage);

    return newMessage;
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
      messagesByConversationId: this.messagesByConversationId,
    };
  }
}
