import type { Spread } from 'lexical';
import { type SerializedTextNode } from 'lexical';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    mentionEntityId: string;
  },
  SerializedTextNode
>;
