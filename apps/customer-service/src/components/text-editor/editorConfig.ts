import { InitialConfigType } from '@lexical/react/LexicalComposer';

import { MentionNode } from '@cs/lib/editor';
import { EmojiNode } from '@cs/lib/editor/nodes/emoji-node';

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
