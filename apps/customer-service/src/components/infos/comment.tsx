'use client';

import { FC, ReactNode } from 'react';
import {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedTextNode,
} from 'lexical';

import { SerializedEmojiNode } from '~/components/text-editor/nodes/emoji-node';

// TODO: add key prop to children
const deserializeChildren = (children: SerializedLexicalNode[]) => {
  const content: ReactNode[] = [];
  for (const child of children) {
    if (child.type === 'paragraph') {
      content.push(
        <>{deserializeChildren((child as SerializedParagraphNode).children)}</>
      );
    } else {
      content.push(dezerializeNode(child));
    }
  }

  return content;
};

const dezerializeNode = (node: SerializedLexicalNode) => {
  switch (node.type) {
    case 'mention':
      return (
        <span className="font-semibold text-foreground">
          @{(node as SerializedTextNode).text}
        </span>
      );
    case 'linebreak':
      return <br />;
    case 'text':
    case 'emoji':
    default:
      return <>{(node as SerializedEmojiNode).text}</>;
  }
};

const deserializeContent = (content: string) => {
  const state = JSON.parse(content) as SerializedEditorState;
  return deserializeChildren(state.root.children);
};

export const Comment: FC<{ content: string }> = ({ content }) => {
  return <>{deserializeContent(content)}</>;
};
