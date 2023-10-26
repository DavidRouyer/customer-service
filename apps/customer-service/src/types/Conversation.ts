import { RouterOutputs } from '@cs/api';

export type ConversationItem = RouterOutputs['ticket']['conversation'][0];

export type Conversation = Record<string, Record<string, ConversationItem[]>>;
