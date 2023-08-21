import { FC, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CLEAR_EDITOR_COMMAND } from 'lexical';

type MyCustomValuePluginProps = {
  value?: string;
};

const MyCustomValuePlugin: FC<MyCustomValuePluginProps> = ({ value }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value === '') {
      editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
    }
  }, [value, editor]);

  return null;
};

export default MyCustomValuePlugin;
