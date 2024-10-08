'use client';

import type {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedParagraphNode,
} from 'lexical';
import type { FC, ReactNode } from 'react';
import { Fragment } from 'react';

import type { SerializedEmojiNode } from '@kyaku/kyaku/editor';

const deserializeChildren = (children: SerializedLexicalNode[]) => {
  const content: ReactNode[] = [];
  children.forEach((child, index) => {
    if (child.type === 'paragraph') {
      content.push(
        <Fragment key={index}>
          {deserializeChildren((child as SerializedParagraphNode).children)}
        </Fragment>,
      );
    } else {
      content.push(<Fragment key={index}>{dezerializeNode(child)}</Fragment>);
    }
  });

  return content;
};

const dezerializeNode = (node: SerializedLexicalNode) => {
  switch (node.type) {
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

export const NodeContent: FC<{ content: string }> = ({ content }) => {
  return <>{deserializeContent(content)}</>;
};
