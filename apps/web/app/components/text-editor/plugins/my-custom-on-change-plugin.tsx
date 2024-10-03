import type { EditorState } from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $getSelection } from 'lexical';

interface MyCustomOnChangePluginProps {
  onChange: (value: string) => void;
}

const MyCustomOnChangePlugin: React.FC<MyCustomOnChangePluginProps> = ({
  onChange,
}) => {
  return (
    <OnChangePlugin
      onChange={(editorState: EditorState) => {
        editorState.read(() => {
          // Read the contents of the EditorState here.
          const root = $getRoot();
          const selection = $getSelection();

          console.debug(root, selection);

          onChange(JSON.stringify(editorState.toJSON()));
        });
      }}
    />
  );
};

export default MyCustomOnChangePlugin;
