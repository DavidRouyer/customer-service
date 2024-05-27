'use client';

import type { FC } from 'react';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { useAtomValue } from 'jotai';
import { FormattedMessage } from 'react-intl';

import { messageModeAtom } from '~/app/_components/messages/message-mode-atom';
import editorConfig from '~/app/_components/text-editor/editorConfig';
import EmoticonPlugin from '~/app/_components/text-editor/plugins/emoticon-plugin';
import NewMentionsPlugin from '~/app/_components/text-editor/plugins/mentions-plugin';
import MyCustomAutoFocusPlugin from '~/app/_components/text-editor/plugins/my-custom-auto-focus-plugin';
import MyCustomCommandHandlerPlugin from '~/app/_components/text-editor/plugins/my-custom-command-handler-plugin';
import MyCustomOnChangePlugin from '~/app/_components/text-editor/plugins/my-custom-on-change-plugin';
import MyCustomValuePlugin from '~/app/_components/text-editor/plugins/my-custom-value-plugin';

interface TextEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

const TextEditor: FC<TextEditorProps> = ({ value, onChange }) => {
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
        <NewMentionsPlugin />
        <MyCustomCommandHandlerPlugin />
      </div>
    </LexicalComposer>
  );
};

TextEditor.displayName = 'TextEditor';

const Placeholder: FC = () => {
  const messageMode = useAtomValue(messageModeAtom);

  return (
    <div className="pointer-events-none absolute left-2 top-4 inline-block select-none overflow-hidden text-ellipsis text-[15px] text-gray-400">
      {messageMode === 'reply' ? (
        <FormattedMessage id="text_editor.message_placeholder" />
      ) : (
        <FormattedMessage id="text_editor.note_placeholder" />
      )}
    </div>
  );
};

Placeholder.displayName = 'Placeholder';

export default TextEditor;
