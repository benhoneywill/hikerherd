import type { FC } from "react";
import type { UseFieldConfig } from "react-final-form";
import type { Editor } from "@tiptap/react";

import React from "react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useField } from "react-final-form";
import { IconButton } from "@chakra-ui/button";
import styled from "@emotion/styled";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaRulerHorizontal,
  FaUndo,
  FaRedo,
  FaImage,
} from "react-icons/fa";
import { HStack } from "@chakra-ui/layout";

export const StyledTiptapContent = styled.div`
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3 {
    line-height: 1.1;
    font-weight: var(--chakra-fontWeights-bold);
  }

  h1 {
    font-size: var(--chakra-fontSizes-6xl);
  }

  h2 {
    font-size: var(--chakra-fontSizes-4xl);
  }

  h3 {
    font-size: var(--chakra-fontSizes-2xl);
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid #d7d7d7;
  }

  hr {
    border: none;
    border-top: 2px solid #d7d7d7;
    margin: 2rem 0;
  }
`;

type TiptapMenuProps = {
  editor: Editor | null;
};

const TiptapMenu: FC<TiptapMenuProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter the URL of your image");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <HStack>
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon={<FaBold />}
        aria-label="bold"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon={<FaItalic />}
        aria-label="italic"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        icon={<FaStrikethrough />}
        aria-label="strike through"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        icon={<FaHeading />}
        aria-label="heading 1"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        icon={<FaHeading />}
        aria-label="heading 2"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        icon={<FaHeading />}
        aria-label="heading 3"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        icon={<FaListUl />}
        aria-label="bullet list"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        icon={<FaListOl />}
        aria-label="numbered list"
      />
      <IconButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        icon={<FaQuoteLeft />}
        aria-label="blockquote"
      />
      <IconButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<FaRulerHorizontal />}
        aria-label="horizontal rule"
      />
      <IconButton onClick={addImage} icon={<FaImage />} aria-label="add image" />
      <IconButton
        onClick={() => editor.chain().focus().undo().run()}
        icon={<FaUndo />}
        aria-label="undo"
      />
      <IconButton
        onClick={() => editor.chain().focus().redo().run()}
        icon={<FaRedo />}
        aria-label="redo"
      />
    </HStack>
  );
};

type TiptapProps = {
  name: string;
  fieldProps?: UseFieldConfig<string>;
};

const Tiptap: FC<TiptapProps> = ({ name, fieldProps }) => {
  const { input } = useField(name, fieldProps);

  const editor = useEditor({
    extensions: [StarterKit, Image],
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

  return (
    <StyledTiptapContent>
      <TiptapMenu editor={editor} />
      <EditorContent editor={editor} />
    </StyledTiptapContent>
  );
};

export default Tiptap;
