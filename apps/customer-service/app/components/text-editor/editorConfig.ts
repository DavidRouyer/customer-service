import type { InitialConfigType } from '@lexical/react/LexicalComposer';

import { EmojiNode } from '@kyaku/kyaku/editor';

import ExampleTheme from './themes/example-theme';

const editorConfig: InitialConfigType = {
  namespace: 'CSEditor',
  theme: ExampleTheme,
  onError(error: Error) {
    throw error;
  },
  nodes: [EmojiNode],
};

export default editorConfig;
