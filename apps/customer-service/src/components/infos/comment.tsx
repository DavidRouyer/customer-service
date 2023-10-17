'use client';

import { FC, Fragment, ReactNode } from 'react';
import {
  SerializedEditorState,
  SerializedLexicalNode,
  SerializedParagraphNode,
  SerializedTextNode,
} from 'lexical';

import { SerializedEmojiNode } from '~/components/text-editor/nodes/emoji-node';

const deserializeChildren = (children: SerializedLexicalNode[]) => {
  const content: ReactNode[] = [];
  children.forEach((child, index) => {
    if (child.type === 'paragraph') {
      content.push(
        <Fragment key={index}>
          {deserializeChildren((child as SerializedParagraphNode).children)}
        </Fragment>
      );
    } else {
      content.push(<Fragment key={index}>{dezerializeNode(child)}</Fragment>);
    }
  });

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
