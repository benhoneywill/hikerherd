import type { FC } from "react";
import type { UseFieldConfig } from "react-final-form";

import type { BoxProps } from "@chakra-ui/layout";

import type { EditorFeatures } from "../helpers/get-editor-extensions";

import React from "react";

import { useEditor, EditorContent } from "@tiptap/react";

import { useField } from "react-final-form";

import getEditorExtensions from "../helpers/get-editor-extensions";

import EditorFloatingMenu from "./editor-floating-menu";
import EditorBubbleMenu from "./editor-bubble-menu";
import EditorHtml from "./editor-html";

type EditorFieldProps = {
  name: string;
  fieldProps?: UseFieldConfig<string>;
  fontSize?: BoxProps["fontSize"];
  features?: EditorFeatures;
};

const EditorField: FC<EditorFieldProps> = ({ name, fieldProps, fontSize, features = {} }) => {
  const { input } = useField(name, fieldProps);

  const editor = useEditor({
    extensions: getEditorExtensions(features),
    content: input.value,
    onBlur: ({ editor }) => {
      input.onChange(editor.getJSON());
      input.onBlur();
    },
    onFocus: () => input.onFocus(),
  });

  if (!editor) return null;

  return (
    <div>
      {editor && <EditorBubbleMenu editor={editor} features={features} />}
      {editor && <EditorFloatingMenu editor={editor} features={features} />}

      <EditorHtml fontSize={fontSize || "md"}>
        <EditorContent editor={editor} />
      </EditorHtml>
    </div>
  );
};

export default EditorField;
