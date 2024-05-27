import { createHeadlessEditor } from '@lexical/headless';
import { $getRoot } from 'lexical';

import { EmojiNode } from './nodes/emoji-node';
import { MentionNode } from './nodes/mention-node';

export const parseTextFromEditorState = (content: string) => {
  return new Promise<string>((resolve, reject) => {
    const editor = createHeadlessEditor({
      disableEvents: true,
      editable: false,
      nodes: [EmojiNode, MentionNode],
      onError: (error) => {
        reject(error);
      },
    });

    editor.setEditorState(editor.parseEditorState(content));
    editor.getEditorState().read(() => {
      const root = $getRoot();

      resolve(root.getTextContent());
    });
  });
};

export const extractMentions = (content: string) => {
  return new Promise<string[]>((resolve, reject) => {
    const editor = createHeadlessEditor({
      disableEvents: true,
      editable: false,
      nodes: [EmojiNode, MentionNode],
      onError: (error) => {
        reject(error);
      },
    });

    editor.setEditorState(editor.parseEditorState(content));
    editor.getEditorState().read(() => {
      const root = $getRoot();

      const textNodes = root
        .getAllTextNodes()
        .filter((node) => node.getType() === 'mention') as MentionNode[];

      resolve(textNodes.map((node) => node.__mentionId));
    });
  });
};
