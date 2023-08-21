import { InitialConfigType } from '@lexical/react/LexicalComposer';

import { EmojiNode } from './nodes/EmojiNode';
import ExampleTheme from './themes/ExampleTheme';

const editorConfig: InitialConfigType = {
  namespace: 'CSEditor',
  theme: ExampleTheme,
  onError(error: Error) {
    throw error;
  },
  nodes: [EmojiNode],
};

export default editorConfig;
