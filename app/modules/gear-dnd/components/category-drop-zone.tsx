import type { FC } from "react";

import { Box, Stack } from "@chakra-ui/layout";
import { Droppable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";

import useModeColors from "app/common/hooks/use-mode-colors";

import useGearDnd from "../hooks/use-gear-dnd";

import DraggableCategory from "./draggable-category";

const CategoryDropZone: FC = () => {
  const { vertical, addCategory, state } = useGearDnd();
  const { gray, blue } = useModeColors();

  return (
    <Droppable
      droppableId="category"
      type="category"
      direction={vertical ? "vertical" : "horizontal"}
    >
      {(provided, snapshot) => (
        <Box
          {...provided.droppableProps}
          ref={provided.innerRef}
          bg={snapshot.isDraggingOver ? blue[100] : gray[100]}
          width="100%"
          height="100%"
        >
          <Stack
            spacing={0}
            align="start"
            overflowX="auto"
            direction={vertical ? "column" : "row"}
            width="100%"
            height="100%"
            px={3}
            py={6}
          >
            {state.map((category, index) => (
              <Box
                key={category.id}
                height="100%"
                width={vertical ? "100%" : "auto"}
              >
                <DraggableCategory category={category} index={index} />
              </Box>
            ))}

            {provided.placeholder}

            <div>
              <Box
                width={vertical ? "100%" : "270px"}
                padding={2}
                bg={gray[50]}
                borderRadius="md"
                mx={vertical ? 0 : 1}
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
            </div>
          </Stack>
        </Box>
      )}
    </Droppable>
  );
};

export default CategoryDropZone;
