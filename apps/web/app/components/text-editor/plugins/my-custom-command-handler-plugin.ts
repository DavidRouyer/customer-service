import { useContext, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND } from 'lexical';

import { FormElementContext } from '~/components/messages/message-form';

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
export default function MyCustomCommandHandlerPlugin() {
  const [editor] = useLexicalComposerContext();
  const form = useContext(FormElementContext);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event: KeyboardEvent) => {
          // skipping if shift is pressed (defaulting to line-break)
          if (!event.ctrlKey) {
            event.preventDefault();
            form?.current?.requestSubmit();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor]);

  return null;
}
