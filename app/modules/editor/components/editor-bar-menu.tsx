import type { FC, ReactElement } from "react";
import type { EditorFeatures } from "../helpers/get-editor-extensions";

import { useContext } from "react";

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
import { useColorModeValue } from "@chakra-ui/react";

import editorContext from "../contexts/editor-context";

type EditorBarMenuButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  icon: ReactElement;
  label: string;
};

const EditorBarMenuButton: FC<EditorBarMenuButtonProps> = ({
  onClick,
  isActive,
  icon,
  label,
}) => {
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
  features?: EditorFeatures;
};

const EditorBarMenu: FC<EditorBarMenuProps> = ({ features = {} }) => {
  const { editor, toggleAddingImage, toggleAddingLink } =
    useContext(editorContext);

  return (
    <HStack
      spacing={1}
      p={1}
      border="1px solid"
      borderTop="none"
      borderBottomLeftRadius="md"
      borderBottomRightRadius="md"
      borderColor="inherit"
      bg={useColorModeValue("gray.50", "gray.700")}
    >
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

      {features.heading && (
        <EditorBarMenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          icon={<FaHeading />}
          label="heading"
        />
      )}

      {features.heading && (
        <EditorBarMenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          icon={<Icon w={3} h={3} as={FaHeading} />}
          label="subheading"
        />
      )}

      {features.blockquote && (
        <EditorBarMenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={<FaQuoteLeft />}
          label="quote"
        />
      )}

      <EditorBarMenuButton
        onClick={toggleAddingLink}
        icon={<FaLink />}
        label="add link"
      />

      {features.image && (
        <EditorBarMenuButton
          onClick={toggleAddingImage}
          icon={<FaImage />}
          label="Image"
        />
      )}

      {features.horizontalRule && (
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
