import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot, $getSelection, EditorState } from 'lexical';

type MyCustomOnChangePluginProps = {
  onChange: (value: string) => void;
};

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

          onChange(root.getTextContent());
        });
      }}
    />
  );
};

export default MyCustomOnChangePlugin;
