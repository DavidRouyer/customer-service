import { FC } from 'react';

import editorConfig from '@/components/TextEditor/editorConfig';
import onChange from '@/components/TextEditor/onChange';
import EmoticonPlugin from '@/components/TextEditor/plugins/EmoticonPlugin';
import MyCustomAutoFocusPlugin from '@/components/TextEditor/plugins/MyCustomAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';

export const TextEditor: FC = () => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <EmoticonPlugin />
        <MyCustomAutoFocusPlugin />
      </div>
    </LexicalComposer>
  );
};

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>;
}
