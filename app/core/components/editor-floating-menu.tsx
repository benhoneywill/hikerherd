import type { FC, ReactElement } from "react";
import type { Editor } from "@tiptap/react";

import type { EditorFeatures } from "../helpers/get-editor-extensions";

import React from "react";

import { FloatingMenu } from "@tiptap/react";

import { IconButton } from "@chakra-ui/button";
import { FaImage, FaRulerHorizontal } from "react-icons/fa";
import { HStack } from "@chakra-ui/layout";

type EditorBubbleMenuButtonProps = {
  onClick: () => void;
  icon: ReactElement;
  label: string;
};

const EditorFloatingMenuButton: FC<EditorBubbleMenuButtonProps> = ({ onClick, icon, label }) => {
  return (
    <IconButton onClick={onClick} icon={icon} aria-label={label} size="sm" borderRadius="100%" />
  );
};

type EditorFloatingMenuProps = {
  editor: Editor;
  features?: Pick<EditorFeatures, "horizontalRule" | "image">;
};

const EditorFloatingMenu: FC<EditorFloatingMenuProps> = ({ editor, features = {} }) => {
  const { horizontalRule = false, image = false } = features;

  // If none of the features are supported don't render the menu
  if (!image && !horizontalRule) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter the URL of your image");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <FloatingMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { selection } = state;
        const { $anchor, empty } = selection;

        const isRootDepth = $anchor.depth === 1;
        const isFirst = $anchor.pos === 1;

        const isEmptyTextBlock =
          $anchor.parent.isTextblock &&
          !$anchor.parent.type.spec.code &&
          !$anchor.parent.textContent;

        return !isFirst && empty && isRootDepth && isEmptyTextBlock;
      }}
    >
      <HStack>
        {image && <EditorFloatingMenuButton onClick={addImage} icon={<FaImage />} label="Image" />}

        {horizontalRule && (
          <EditorFloatingMenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={<FaRulerHorizontal />}
            label="Horizontal rule"
          />
        )}
      </HStack>
    </FloatingMenu>
  );
};

export default EditorFloatingMenu;
