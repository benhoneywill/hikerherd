import type { EditorFeatures } from "../helpers/get-editor-extensions";

import { useMemo } from "react";

import { generateHTML } from "@tiptap/react";

import getEditorExtensions from "../helpers/get-editor-extensions";

export type EditorHtmlOptions = {
  snippet?: boolean;
};

const useEditorHtml = (
  content: string,
  features: EditorFeatures = {},
  options: EditorHtmlOptions = {}
) => {
  return useMemo(() => {
    try {
      let json = JSON.parse(content);

      if (options.snippet) {
        json = { ...json, content: json?.content?.slice(0, 4) };
      }

      return generateHTML(json, getEditorExtensions(features));
    } catch (error) {
      return "<p>Oops! There was an error rendering this content</p>";
    }
  }, [content, features, options]);
};

export default useEditorHtml;
