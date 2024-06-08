import type { InitialConfigType } from '@lexical/react/LexicalComposer';

import { EmojiNode, MentionNode } from '@cs/kyaku/editor';

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
