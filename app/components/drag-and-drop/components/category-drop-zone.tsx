import type { FC } from "react";

import { useContext } from "react";

import { Box, Stack } from "@chakra-ui/layout";
import { Droppable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/react";

import useCalculatePackTotals from "app/apps/packs/hooks/use-calculate-pack-totals";
import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";

import dragAndDropContext from "../contexts/gear-dnd-context";

import DraggableCategory from "./draggable-category";
import HorizontalScroller from "./horizontal-scroller";

const CategoryDropZone: FC = () => {
  const { compact } = useContext(userPreferencesContext);
  const { addCategory, state, readonly } = useContext(dragAndDropContext);

  const { categories } = useCalculatePackTotals(state);

  const dragColor = useColorModeValue("blue.200", "blue.700");

  return (
    <HorizontalScroller>
      <Droppable
        droppableId="category"
        type="category"
        isDropDisabled={readonly}
        direction={compact ? "vertical" : "horizontal"}
      >
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            bg={snapshot.isDraggingOver ? dragColor : ""}
            height="100%"
            flex="1 0 auto"
            userSelect="none"
          >
            <Stack
              spacing={0}
              alignItems="flex-start"
              mx={compact ? "auto" : "0"}
              width="100%"
              height="100%"
              px={3}
              py={6}
              direction={compact ? "column" : "row"}
              maxWidth={compact ? "1000px" : "auto"}
            >
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
                  width={compact ? "100%" : "290px"}
                  flex={`0 0 ${compact ? "100%" : "290px"}`}
                  padding={2}
                  borderRadius="md"
                  mx={1}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <Button
                    isFullWidth
                    size={compact ? "lg" : "sm"}
                    colorScheme="blue"
                    onClick={addCategory}
                  >
                    New category
                  </Button>
                </Box>
              )}
            </Stack>
          </Box>
        )}
      </Droppable>
    </HorizontalScroller>
  );
};

export default CategoryDropZone;
