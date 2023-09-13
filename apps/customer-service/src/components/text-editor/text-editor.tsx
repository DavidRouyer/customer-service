'use client';

import { FC } from 'react';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { FormattedMessage } from 'react-intl';

import editorConfig from '~/components/text-editor/editorConfig';
import EmoticonPlugin from '~/components/text-editor/plugins/emoticon-plugin';
import MyCustomAutoFocusPlugin from '~/components/text-editor/plugins/my-custom-auto-focus-plugin';
import MyCustomCommandHandlerPlugin from '~/components/text-editor/plugins/my-custom-command-handler-plugin';
import MyCustomOnChangePlugin from '~/components/text-editor/plugins/my-custom-on-change-plugin';
import MyCustomValuePlugin from '~/components/text-editor/plugins/my-custom-value-plugin';

type TextEditorProps = {
  value?: string;
  onChange: (value: string) => void;
};

export const TextEditor: FC<TextEditorProps> = ({ value, onChange }) => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative bg-transparent text-left font-normal leading-5 text-foreground">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              className="relative min-h-[128px] resize-none px-2 py-4 text-[15px] caret-muted-foreground outline-none"
              style={{ tabSize: '1' }}
            />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MyCustomValuePlugin value={value} />
        <MyCustomOnChangePlugin onChange={onChange} />
        <HistoryPlugin />
        <EmoticonPlugin />
        <ClearEditorPlugin />
        <MyCustomAutoFocusPlugin />
        <MyCustomCommandHandlerPlugin />
      </div>
    </LexicalComposer>
  );
};

TextEditor.displayName = 'TextEditor';

const Placeholder: FC = () => {
  return (
    <div className="pointer-events-none absolute left-2 top-4 inline-block select-none overflow-hidden text-ellipsis text-[15px] text-gray-400">
      <FormattedMessage id="text_editor.placeholder" />
    </div>
  );
};

Placeholder.displayName = 'Placeholder';
