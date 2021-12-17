import { useContext } from "react";

import editorContext from "../contexts/editor-context";

const useEditorContext = () => {
  return useContext(editorContext);
};

export default useEditorContext;
