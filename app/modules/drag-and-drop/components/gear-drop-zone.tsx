import type { DragAndDropState } from "../contexts/gear-dnd-context";
import type { FC } from "react";

import { useContext } from "react";

import { Droppable } from "react-beautiful-dnd";
import { Box } from "@chakra-ui/layout";
import { useColorModeValue, useTheme } from "@chakra-ui/react";

import dragAndDropContext from "../contexts/gear-dnd-context";

import DraggableGear from "./draggable-gear";

type GearDropZoneProps = {
  droppableId: string;
  items: DragAndDropState[number]["items"];
};

const GearDropZone: FC<GearDropZoneProps> = ({ droppableId, items }) => {
  const { readonly } = useContext(dragAndDropContext);
  const theme = useTheme();

  const innerBg = useColorModeValue("", "gray.700");
  const dragColor = useColorModeValue("blue.200", "blue.700");

  const scrollBarStyles = {
    "@-moz-document url-prefix()": {
      paddingRight: 8,
    },
    "&::-webkit-scrollbar": {
      width: "8px",
      overflow: "hidden",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      background: useColorModeValue(
        theme.colors.gray[400],
        theme.colors.gray[500]
      ),
      borderRadius: "2px",
      border: "1px solid transparent",
      backgroundClip: "padding-box",
    },
  };

  return (
    <Box overflowY="scroll" mr="-8px" css={scrollBarStyles}>
      <Droppable
        type="item"
        droppableId={droppableId}
        isDropDisabled={readonly}
      >
        {(provided, snapshot) => {
          return (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              px={1}
              minHeight={1}
              width="100%"
              bg={snapshot.isDraggingOver ? dragColor : innerBg}
              borderRadius="md"
            >
              {items.map((item, index) => (
                <DraggableGear data={items} index={index} key={item.id} />
              ))}

              {provided.placeholder}
            </Box>
          );
        }}
      </Droppable>
    </Box>
  );
};

export default GearDropZone;
