import type { FC } from "react";

import { useContext } from "react";

import { Box } from "@chakra-ui/layout";
import { Droppable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/react";

import useCalculatePackTotals from "app/apps/packs/hooks/use-calculate-pack-totals";

import dragAndDropContext from "../contexts/gear-dnd-context";

import DraggableCategory from "./draggable-category";
import HorizontalScroller from "./horizontal-scroller";

const CategoryDropZone: FC = () => {
  const { addCategory, state, readonly } = useContext(dragAndDropContext);

  const { categories } = useCalculatePackTotals(state);

  const dragColor = useColorModeValue("blue.200", "blue.700");

  return (
    <Droppable
      droppableId="category"
      type="category"
      isDropDisabled={readonly}
      direction="horizontal"
    >
      {(provided, snapshot) => (
        <Box
          {...provided.droppableProps}
          ref={provided.innerRef}
          bg={snapshot.isDraggingOver ? dragColor : ""}
          width="100%"
          height="100%"
          userSelect="none"
        >
          <HorizontalScroller>
            {categories.map((category, index) => (
              <DraggableCategory
                key={category.id}
                category={category}
                index={index}
              />
            ))}

            {provided.placeholder}

            {addCategory && (
              <Box
                width="290px"
                flex="0 0 290px"
                padding={2}
                borderRadius="md"
                mx={1}
              >
                <Button
                  isFullWidth
                  size="sm"
                  colorScheme="blue"
                  onClick={addCategory}
                >
                  New category
                </Button>
              </Box>
            )}
          </HorizontalScroller>
        </Box>
      )}
    </Droppable>
  );
};

export default CategoryDropZone;
