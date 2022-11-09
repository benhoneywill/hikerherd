import type { DragAndDropState } from "../contexts/gear-dnd-context";
import type { FC } from "react";

import { useContext, memo } from "react";

import { Draggable } from "react-beautiful-dnd";
import { Box } from "@chakra-ui/layout";

import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";

import dragAndDropContext from "../contexts/gear-dnd-context";

import Category from "./category";

type DraggableCategoryProps = {
  category: DragAndDropState[number] & { weight: number };
  index: number;
};

const DraggableCategory: FC<DraggableCategoryProps> = memo(
  ({ category, index }) => {
    const { readonly } = useContext(dragAndDropContext);
    const { compact } = useContext(userPreferencesContext);

    return (
      <Box
        key={category.id}
        height={compact ? "auto" : "100%"}
        width={compact ? "100%" : "auto"}
        pointerEvents="none"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Draggable
          draggableId={category.id}
          index={index}
          isDragDisabled={readonly}
        >
          {(provided, snapshot) => (
            <Category
              category={category}
              isDragging={snapshot.isDragging}
              provided={provided}
            />
          )}
        </Draggable>
      </Box>
    );
  }
);

export default DraggableCategory;
