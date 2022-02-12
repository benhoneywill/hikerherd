import type { FC } from "react";

import { useRef, useState, useContext } from "react";

import { Box, HStack } from "@chakra-ui/layout";
import { Droppable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";
import {
  useBreakpointValue,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";

import dragAndDropContext from "../contexts/gear-dnd-context";

import DraggableCategory from "./draggable-category";

const CategoryDropZone: FC = () => {
  const { addCategory, state, readonly } = useContext(dragAndDropContext);
  const theme = useTheme();

  const dragColor = useColorModeValue("blue.200", "blue.700");
  const bgDragEnabled = useBreakpointValue({ base: false, md: true });

  const scroller = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const scrollBarStyles = {
    "&::-webkit-scrollbar": {
      height: "24px",
    },
    "&::-webkit-scrollbar-track": {
      background: useColorModeValue(
        theme.colors.gray[200],
        theme.colors.gray[700]
      ),
    },
    "&::-webkit-scrollbar-thumb": {
      background: useColorModeValue(
        theme.colors.gray[400],
        theme.colors.gray[500]
      ),
      borderRadius: "24px",
      border: "4px solid transparent",
      backgroundClip: "padding-box",
    },
  };

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
        >
          <HStack
            spacing={0}
            overflowX="auto"
            alignItems="flex-start"
            width="100%"
            height="100%"
            css={bgDragEnabled && scrollBarStyles}
            px={3}
            pt={6}
            pb={bgDragEnabled ? 2 : 6}
            ref={scroller}
            onMouseDown={(e) => {
              if (
                scroller.current &&
                e.target === scroller.current &&
                bgDragEnabled
              ) {
                setIsDown(true);
                setStartX(e.pageX - scroller.current?.offsetLeft);
                setScrollLeft(scroller.current?.scrollLeft);
              }
            }}
            onMouseLeave={(e) => {
              if (
                scroller.current &&
                e.target === scroller.current &&
                bgDragEnabled
              ) {
                setIsDown(false);
              }
            }}
            onMouseUp={(e) => {
              if (
                scroller.current &&
                e.target === scroller.current &&
                bgDragEnabled
              ) {
                setIsDown(false);
              }
            }}
            onMouseMove={(e) => {
              if (
                scroller.current &&
                e.target === scroller.current &&
                bgDragEnabled &&
                isDown
              ) {
                e.preventDefault();
                const x = e.pageX - scroller.current.offsetLeft;
                const walk = x - startX;
                scroller.current.scrollLeft = scrollLeft - walk;
              }
            }}
          >
            {state.map((category, index) => (
              <Box key={category.id} height="100%" pointerEvents="none">
                <DraggableCategory category={category} index={index} />
              </Box>
            ))}

            {provided.placeholder}

            {addCategory && (
              <Box
                width="280px"
                flex="0 0 280px"
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
          </HStack>
        </Box>
      )}
    </Droppable>
  );
};

export default CategoryDropZone;
