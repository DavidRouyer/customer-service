import { Message } from '@/hooks/useTicket/Message';
import { Ticket, TicketId } from '@/hooks/useTicket/Ticket';
import { TicketState } from '@/hooks/useTicket/TicketState';
import { User } from '@/hooks/useTicket/User';

export class TicketStorage {
  private currentUser?: User;
  private tickets: Ticket[] = [];
  private activeTicketId?: TicketId;
  private messagesByTicketId = new Map<string, Message[]>();

  /**
   * Sets current user
   * @param user
   */
  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  /**
   * Checks if ticket exists
   * @param ticketId
   */
  private ticketExists(ticketId: TicketId) {
    return this.getTicketIdx(ticketId) !== -1;
  }

  /**
   * Gets ticket index in tickets array
   * @param ticketId
   * @returns index of ticket in tickets array or -1 if it doesn't exist
   */
  private getTicketIdx(ticketId: TicketId) {
    return this.tickets.findIndex((c) => c.id === ticketId);
  }

  /**
   * Gets ticket in tickets array
   * @param ticketId
   * @returns ticket or undefined if it doesn't exist
   */
  getTicket(ticketId: TicketId) {
    return this.tickets.find((c) => c.id === ticketId);
  }

  /**
   * Adds ticket if it doesn't exist
   * @param ticket
   * @returns true if ticket was added, false if it already exists
   */
  addTicket(ticket: Ticket) {
    const notExists = !this.ticketExists(ticket.id);
    if (notExists) {
      this.tickets.unshift(ticket);
    }

    return notExists;
  }

  /**
   * Removes ticket if it exists
   * @param ticketId
   * @returns true if ticket was removed, false if it doesn't exist
   */
  removeTicket(ticketId: TicketId) {
    const ticketIdx = this.getTicketIdx(ticketId);

    if (ticketIdx !== -1) {
      this.tickets = this.tickets
        .slice(0, ticketIdx)
        .concat(this.tickets.slice(ticketIdx + 1));

      if (this.messagesByTicketId.has(ticketId)) {
        this.messagesByTicketId.delete(ticketId);
      }

      return true;
    }

    return false;
  }

  /**
   * Sets active ticket
   * @param ticketId
   */
  setActiveTicket(ticketId?: TicketId) {
    this.activeTicketId = ticketId;
  }

  /**
   * Adds message to ticket
   * @param ticketId
   * @param message
   * @returns added message
   */
  addMessage(ticketId: TicketId, message: Message) {
    if (!this.messagesByTicketId.has(ticketId)) {
      this.messagesByTicketId.set(ticketId, [message]);

      return message;
    }

    // TODO: refactor
    const newMessage = { ...message };
    const messages = this.messagesByTicketId.get(ticketId);

    if (!messages) {
      this.messagesByTicketId.set(ticketId, [newMessage]);

      return newMessage;
    }

    const foundMessageId = messages.findIndex((m) => m.id === newMessage.id);
    if (foundMessageId === -1) {
      messages.push(newMessage);
    } else {
      messages.splice(foundMessageId, 1, newMessage);
    }

    return newMessage;
  }

  updateMessage(
    ticketId: TicketId,
    messageIdToUpdate: string,
    message: Message
  ) {
    const messages = this.messagesByTicketId.get(ticketId);
    if (!messages) return;

    const foundMessageId = messages.findIndex(
      (m) => m.id === messageIdToUpdate
    );
    if (foundMessageId === -1) return;

    messages.splice(foundMessageId, 1, message);
  }

  /**
   * Gets current state
   * @returns current state
   */
  getState(): TicketState {
    return {
      currentUser: this.currentUser,
      tickets: this.tickets,
      activeTicket: this.activeTicketId
        ? this.getTicket(this.activeTicketId)
        : undefined,
      currentMessages:
        this.activeTicketId && this.messagesByTicketId.has(this.activeTicketId)
          ? this.messagesByTicketId.get(this.activeTicketId)!
          : [],
      messagesByTicketId: this.messagesByTicketId,
    };
  }
}
