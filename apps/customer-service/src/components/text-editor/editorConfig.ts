import { InitialConfigType } from '@lexical/react/LexicalComposer';

import { MentionNode } from '~/components/text-editor/nodes/mention-node';
import { EmojiNode } from './nodes/emoji-node';
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
