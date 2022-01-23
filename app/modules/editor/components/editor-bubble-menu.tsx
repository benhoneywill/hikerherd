import type { FC, ReactElement } from "react";
import type { EditorFeatures } from "../helpers/get-editor-extensions";

import React, { useContext } from "react";

import "tippy.js/dist/svg-arrow.css";
import { isTextSelection, BubbleMenu } from "@tiptap/react";
import { roundArrow } from "tippy.js";
import { IconButton } from "@chakra-ui/button";
import {
  FaBold,
  FaItalic,
  FaHeading,
  FaQuoteLeft,
  FaLink,
  FaStrikethrough,
} from "react-icons/fa";
import { HStack } from "@chakra-ui/layout";
import Icon from "@chakra-ui/icon";
import { DarkMode } from "@chakra-ui/react";

import editorContext from "../contexts/editor-context";

type EditorBubbleMenuButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  icon: ReactElement;
  label: string;
};

const EditorBubbleMenuButton: FC<EditorBubbleMenuButtonProps> = ({
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
      borderRadius="none"
    />
  );
};

type EditorBubbleMenuProps = {
  features?: Pick<EditorFeatures, "heading" | "blockquote">;
};

const EditorBubbleMenu: FC<EditorBubbleMenuProps> = ({ features = {} }) => {
  const { editor, toggleAddingLink } = useContext(editorContext);

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ arrow: roundArrow }}
      shouldShow={({ editor, state, from, to }) => {
        const { doc, selection } = state;
        const { empty } = selection;

        const isEmptyTextBlock =
          !doc.textBetween(from, to).length && isTextSelection(state.selection);

        if (empty || isEmptyTextBlock) {
          return false;
        }

        return editor.isActive("paragraph") || editor.isActive("heading");
      }}
    >
      <DarkMode>
        <HStack spacing={0} bg="black" borderRadius="md" zIndex="99">
          <EditorBubbleMenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<FaBold />}
            label="bold"
          />

          <EditorBubbleMenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<FaItalic />}
            label="italic"
          />

          <EditorBubbleMenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={<FaStrikethrough />}
            label="strike"
          />

          {features.heading && (
            <EditorBubbleMenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              isActive={editor.isActive("heading", { level: 2 })}
              icon={<FaHeading />}
              label="heading"
            />
          )}

          {features.heading && (
            <EditorBubbleMenuButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              isActive={editor.isActive("heading", { level: 3 })}
              icon={<Icon w={3} h={3} as={FaHeading} />}
              label="subheading"
            />
          )}

          {features.blockquote && (
            <EditorBubbleMenuButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              icon={<FaQuoteLeft />}
              label="quote"
            />
          )}

          <EditorBubbleMenuButton
            onClick={toggleAddingLink}
            icon={<FaLink />}
            label="add link"
          />
        </HStack>
      </DarkMode>
    </BubbleMenu>
  );
};

export default EditorBubbleMenu;
