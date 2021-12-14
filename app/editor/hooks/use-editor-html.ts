import type { EditorFeatures } from "../../editor/helpers/get-editor-extensions";

import { useMemo } from "react";

import { generateHTML } from "@tiptap/react";

import getEditorExtensions from "../../editor/helpers/get-editor-extensions";

const useEditorHtml = (content: string, features: EditorFeatures = {}) => {
  return useMemo(() => {
    try {
      return generateHTML(JSON.parse(content), getEditorExtensions(features));
    } catch (error) {
      return "<p>There was an error rendering this content</p>";
    }
  }, [content, features]);
};

export default useEditorHtml;
