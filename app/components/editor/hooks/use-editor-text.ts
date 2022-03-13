import type { EditorFeatures } from "../helpers/get-editor-extensions";
import type { HtmlToTextOptions } from "html-to-text";

import { useMemo } from "react";

import { convert } from "html-to-text";

import useEditorHtml from "./use-editor-html";

const useEditorText = (
  content: string,
  features: EditorFeatures = {},
  options: HtmlToTextOptions = {}
) => {
  const html = useEditorHtml(content, features);

  return useMemo(() => {
    return convert(html, options);
  }, [html, options]);
};

export default useEditorText;
