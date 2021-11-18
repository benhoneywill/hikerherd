import type { FC } from "react";
import type { UseFieldConfig } from "react-final-form";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useField } from "react-final-form";

type TiptapProps = {
  name: string;
  fieldProps?: UseFieldConfig<string>;
};

export const Tiptap: FC<TiptapProps> = ({ name, fieldProps }) => {
  const { input } = useField(name, fieldProps);

  const editor = useEditor({
    extensions: [StarterKit],
    content: input.value,
    onBlur() {
      input.onBlur();
    },
    onFocus() {
      input.onFocus();
    },
    onUpdate({ editor }) {
      input.onChange(editor.getJSON());
    },
  });

  return <EditorContent editor={editor} />;
};
