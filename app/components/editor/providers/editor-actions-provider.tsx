import type { FC } from "react";
import type { Editor } from "@tiptap/react";

import { useState } from "react";

import editorActionsContext from "../contexts/editor-context";
import EditorAddLink from "../components/editor-add-link";
import EditorAddImage from "../components/editor-add-image";

const { Provider } = editorActionsContext;

type EditorActionsProviderProps = {
  editor: Editor;
};

const EditorActionsProvider: FC<EditorActionsProviderProps> = ({
  editor,
  children,
}) => {
  const [addingLink, setAddingLink] = useState(false);
  const [addingImage, setAddingImage] = useState(false);

  const toggleAddingLink = () => setAddingLink((state) => !state);
  const toggleAddingImage = () => setAddingImage((state) => !state);

  return (
    <Provider
      value={{
        editor,

        addingLink,
        toggleAddingLink,

        addingImage,
        toggleAddingImage,
      }}
    >
      {addingLink && <EditorAddLink />}
      {addingImage && <EditorAddImage />}

      {children}
    </Provider>
  );
};

export default EditorActionsProvider;
