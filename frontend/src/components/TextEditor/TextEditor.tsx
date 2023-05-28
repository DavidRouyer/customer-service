import { FC } from 'react';
import { Trans } from 'react-i18next';

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
      <div className="relative bg-transparent text-left font-normal leading-5 text-black">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              className="relative min-h-[150px] resize-none px-2 py-4 text-[15px] caret-gray-800"
              style={{ tabSize: '1' }}
            />
          }
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

TextEditor.displayName = 'TextEditor';

const Placeholder: FC = () => {
  return (
    <div className="pointer-events-none absolute left-2 top-4 inline-block select-none overflow-hidden text-ellipsis text-[15px] text-gray-400">
      <Trans i18nKey="text_editor.placeholder" />
    </div>
  );
};

Placeholder.displayName = 'Placeholder';
