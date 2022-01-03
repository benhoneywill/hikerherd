import type { UseFieldConfig } from "react-final-form";
import type { Editor } from "@tiptap/react";
import type { EditorFeatures } from "../helpers/get-editor-extensions";

import { useState, useEffect } from "react";

import { useEditor } from "@tiptap/react";
import { useField } from "react-final-form";

import getEditorExtensions from "../helpers/get-editor-extensions";

type UseEditorFieldOptions = {
  fieldProps?: UseFieldConfig<string>;
  features?: EditorFeatures;
  options?: {
    required?: boolean;
    requiredError?: string;
    autofocus?: boolean;
  };
};

const useEditorField = (
  name: string,
  { fieldProps = {}, features = {}, options = {} }: UseEditorFieldOptions
) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [showError, setShowError] = useState(false);
  const [focused, setFocused] = useState(false);

  const {
    required = true,
    requiredError = "Did you forget to write something?",
    autofocus,
  } = options;

  const { input, meta } = useField(name, {
    ...fieldProps,
    validate: () => {
      if (required && !editor?.getText().trim()) {
        return requiredError;
      }
    },
  });

  const tiptap = useEditor({
    extensions: getEditorExtensions(features),
    content: input.value,
    autofocus: autofocus && "end",
    onBlur: ({ editor }) => {
      input.onChange(editor.getJSON());
      input.onBlur();
      setShowError(true);
      setFocused(false);
    },
    onUpdate: () => {
      setShowError(false);
    },
    onFocus: () => {
      input.onFocus();
      setFocused(true);
    },
  });

  useEffect(() => {
    setEditor(tiptap);
  }, [tiptap]);

  const { error, submitError, submitFailed } = meta;
  const normalizedError = Array.isArray(error)
    ? error.join(", ")
    : error || submitError;

  useEffect(() => {
    if (submitFailed) setShowError(true);
  }, [submitFailed]);

  return {
    editor,
    error: showError && normalizedError,
    meta: { ...meta, focused },
  };
};

export default useEditorField;
