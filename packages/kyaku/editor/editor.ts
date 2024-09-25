import { createHeadlessEditor } from '@lexical/headless';
import { $getRoot } from 'lexical';

import { EmojiNode } from './nodes/emoji-node';

export const parseTextFromEditorState = (content: string) => {
  return new Promise<string>((resolve, reject) => {
    const editor = createHeadlessEditor({
      disableEvents: true,
      editable: false,
      nodes: [EmojiNode],
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
