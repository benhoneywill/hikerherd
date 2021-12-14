import type { FC, ReactElement } from "react";
import type { Editor } from "@tiptap/react";
import type { EditorFeatures } from "../helpers/get-editor-extensions";

import React from "react";

import { IconButton } from "@chakra-ui/button";
import {
  FaBold,
  FaItalic,
  FaHeading,
  FaQuoteLeft,
  FaLink,
  FaStrikethrough,
  FaImage,
  FaRulerHorizontal,
} from "react-icons/fa";
import { HStack } from "@chakra-ui/layout";
import Icon from "@chakra-ui/icon";

type EditorBarMenuButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  icon: ReactElement;
  label: string;
};

const EditorBarMenuButton: FC<EditorBarMenuButtonProps> = ({ onClick, isActive, icon, label }) => {
  return (
    <IconButton
      variant="ghost"
      onClick={onClick}
      isActive={isActive}
      icon={icon}
      aria-label={label}
      size="sm"
    />
  );
};

type EditorBarMenuProps = {
  editor: Editor;
  features?: EditorFeatures;
};

const EditorBarMenu: FC<EditorBarMenuProps> = ({ editor, features = {} }) => {
  const { heading = false, blockquote = false, horizontalRule = false, image = false } = features;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter the URL of your image");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <HStack spacing={1} px={1} py={2}>
      <EditorBarMenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon={<FaBold />}
        label="bold"
      />

      <EditorBarMenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon={<FaItalic />}
        label="italic"
      />

      <EditorBarMenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        icon={<FaStrikethrough />}
        label="strike"
      />

      {heading && (
        <EditorBarMenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          icon={<FaHeading />}
          label="heading"
        />
      )}

      {heading && (
        <EditorBarMenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          icon={<Icon w={3} h={3} as={FaHeading} />}
          label="subheading"
        />
      )}

      {blockquote && (
        <EditorBarMenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={<FaQuoteLeft />}
          label="quote"
        />
      )}

      <EditorBarMenuButton onClick={addLink} icon={<FaLink />} label="add link" />

      {image && <EditorBarMenuButton onClick={addImage} icon={<FaImage />} label="Image" />}

      {horizontalRule && (
        <EditorBarMenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<FaRulerHorizontal />}
          label="Horizontal rule"
        />
      )}
    </HStack>
  );
};

export default EditorBarMenu;
