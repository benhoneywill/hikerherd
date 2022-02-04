import type { Editor } from "@tiptap/react";

import { createContext } from "react";

type EditorContext = {
  editor: Editor;

  addingLink: boolean;
  toggleAddingLink: () => void;

  addingImage: boolean;
  toggleAddingImage: () => void;
};

const editorContext = createContext<EditorContext>({} as EditorContext);

export default editorContext;
