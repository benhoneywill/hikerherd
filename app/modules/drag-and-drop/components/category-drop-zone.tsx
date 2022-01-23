import type { FC } from "react";

import { useContext } from "react";

import { Box, HStack } from "@chakra-ui/layout";
import { Droppable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";

import dragAndDropContext from "../contexts/gear-dnd-context";

import DraggableCategory from "./draggable-category";

const CategoryDropZone: FC = () => {
  const { addCategory, state, readonly } = useContext(dragAndDropContext);

  return (
    <Droppable droppableId="category" type="category" isDropDisabled={readonly}>
      {(provided, snapshot) => (
        <Box
          {...provided.droppableProps}
          ref={provided.innerRef}
          bg={snapshot.isDraggingOver ? "blue" : "gray"}
          width="100%"
          height="100%"
        >
          <HStack
            spacing={0}
            overflowX="auto"
            width="100%"
            height="100%"
            px={3}
            py={6}
          >
            {state.map((category, index) => (
              <Box key={category.id} height="100%">
                <DraggableCategory category={category} index={index} />
              </Box>
            ))}

            {provided.placeholder}

            {addCategory && (
              <Box width="270px" padding={2} borderRadius="md" mx={1}>
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
          </HStack>
        </Box>
      )}
    </Droppable>
  );
};

export default CategoryDropZone;
