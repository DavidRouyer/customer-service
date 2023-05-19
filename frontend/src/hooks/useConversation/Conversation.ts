export type ConversationId = string;

export class Conversation {
  readonly id: ConversationId;
  description: string;

  constructor(id: ConversationId, description: string) {
    this.id = id;
    this.description = description;
  }
}
