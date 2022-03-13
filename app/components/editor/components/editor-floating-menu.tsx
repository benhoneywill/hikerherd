import type { FC, ReactElement } from "react";
import type { EditorFeatures } from "../helpers/get-editor-extensions";

import React, { useContext } from "react";

import { FloatingMenu } from "@tiptap/react";
import { IconButton } from "@chakra-ui/button";
import { FaImage, FaRulerHorizontal } from "react-icons/fa";
import { HStack } from "@chakra-ui/layout";

import editorContext from "../contexts/editor-context";

type EditorBubbleMenuButtonProps = {
  onClick: () => void;
  icon: ReactElement;
  label: string;
};

const EditorFloatingMenuButton: FC<EditorBubbleMenuButtonProps> = ({
  onClick,
  icon,
  label,
}) => {
  return (
    <IconButton
      onClick={onClick}
      icon={icon}
      aria-label={label}
      size="sm"
      borderRadius="100%"
    />
  );
};

type EditorFloatingMenuProps = {
  features?: Pick<EditorFeatures, "horizontalRule" | "image">;
};

const EditorFloatingMenu: FC<EditorFloatingMenuProps> = ({ features = {} }) => {
  const { editor, toggleAddingImage } = useContext(editorContext);

  // If none of the features are supported don't render the menu
  if (!features.image && !features.horizontalRule) {
    return null;
  }

  return (
    <FloatingMenu
      editor={editor}
      shouldShow={({ state }) => {
        const { selection } = state;
        const { $anchor, empty } = selection;

        const isRootDepth = $anchor.depth === 1;
        const isFirst = $anchor.pos === 1;

        const isEmptyTextBlock =
          $anchor.parent.isTextblock && !$anchor.parent.textContent;

        return !isFirst && empty && isRootDepth && isEmptyTextBlock;
      }}
    >
      <HStack>
        {features.image && (
          <EditorFloatingMenuButton
            onClick={toggleAddingImage}
            icon={<FaImage />}
            label="Image"
          />
        )}

        {features.horizontalRule && (
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
