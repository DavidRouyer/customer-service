import {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedParagraphNode,
} from 'lexical';

import { SerializedMentionNode } from './SerializedMentionNode';

export const extractMentions = (content: SerializedEditorState) => {
  return extractMentionsChildren(content.root.children);
};

const extractMentionsChildren = (children: SerializedLexicalNode[]) => {
  let mentionIds: number[] = [];
  for (const child of children) {
    if (child.type === 'paragraph') {
      mentionIds = mentionIds.concat(
        extractMentionsChildren((child as SerializedParagraphNode).children)
      );
    } else {
      const mentionId = extractMentionsNode(child);
      if (mentionId) {
        mentionIds.push(mentionId);
      }
    }
  }

  return mentionIds;
};

const extractMentionsNode = (node: SerializedLexicalNode) => {
  switch (node.type) {
    case 'mention':
      return (node as SerializedMentionNode).mentionEntityId;
    default:
      return null;
  }
};
