import type { BlitzPage } from "blitz";
import type { DragAndDropState } from "../contexts/gear-dnd-context";

import { useContext } from "react";

import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, IconButton } from "@chakra-ui/button";
import { HStack, Heading, Box, Flex } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";
import { Menu, MenuButton } from "@chakra-ui/menu";
import { BsThreeDotsVertical } from "react-icons/bs";

import dragAndDropContext from "../contexts/gear-dnd-context";

import DraggableGear from "./draggable-gear";

type DraggableCategoryProps = {
  category: DragAndDropState[number];
  index: number;
};

const DraggableCategory: BlitzPage<DraggableCategoryProps> = ({
  category,
  index,
}) => {
  const { categoryMenu, addItemToCategory, readonly, editCategory } =
    useContext(dragAndDropContext);

  const bg = useColorModeValue("white", "gray.700");
  const innerBg = useColorModeValue("", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const borderWidth = useColorModeValue("2px", "1px");
  const dragColor = useColorModeValue("blue.200", "blue.700");

  return (
    <Draggable
      draggableId={category.id}
      index={index}
      isDragDisabled={readonly}
    >
      {(provided, snapshot) => (
        <Flex
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={provided.draggableProps.style}
          userSelect="none"
          pointerEvents="all"
          px={2}
          pb={2}
          borderStyle="solid"
          borderWidth={borderWidth}
          bg={bg}
          borderColor={snapshot.isDragging ? "blue.400" : borderColor}
          borderRadius="md"
          mx={2}
          width="280px"
          maxH="100%"
          direction="column"
        >
          <HStack
            {...provided.dragHandleProps}
            align="center"
            justify="space-between"
            px={1}
            py={3}
            pb={2}
          >
            <Heading
              size="sm"
              cursor={editCategory && "pointer"}
              onClick={editCategory && (() => editCategory(category.id))}
            >
              {category.name}
            </Heading>
            {categoryMenu && (
              <Menu>
                <MenuButton
                  as={IconButton}
                  borderRadius="full"
                  icon={<BsThreeDotsVertical />}
                  size="xs"
                  aria-label="actions"
                />
                {categoryMenu(category)}
              </Menu>
            )}
          </HStack>

          <Box overflowY="auto" mr="-8px" pr="8px">
            <Droppable
              type="item"
              droppableId={category.id}
              isDropDisabled={readonly}
            >
              {(provided, snapshot) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  px={1}
                  minHeight={1}
                  width="100%"
                  bg={snapshot.isDraggingOver ? dragColor : innerBg}
                  borderRadius="md"
                >
                  {category.items.map((item, index) => (
                    <DraggableGear item={item} index={index} key={item.id} />
                  ))}

                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </Box>

          {addItemToCategory && (
            <Box p={1}>
              <Button
                isFullWidth
                size="sm"
                onClick={() => addItemToCategory(category.id)}
                colorScheme="blue"
              >
                Add
              </Button>
            </Box>
          )}
        </Flex>
      )}
    </Draggable>
  );
};

export default DraggableCategory;
