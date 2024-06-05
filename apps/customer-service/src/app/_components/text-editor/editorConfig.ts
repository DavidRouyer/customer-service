import type { InitialConfigType } from '@lexical/react/LexicalComposer';

import { MentionNode } from '@cs/kyaku/editor';
import { EmojiNode } from '@cs/kyaku/editor/nodes/emoji-node';

import ExampleTheme from './themes/example-theme';

const editorConfig: InitialConfigType = {
  namespace: 'CSEditor',
  theme: ExampleTheme,
  onError(error: Error) {
    throw error;
  },
  nodes: [EmojiNode, MentionNode],
};

export default editorConfig;
