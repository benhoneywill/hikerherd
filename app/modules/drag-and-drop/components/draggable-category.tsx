import type { BlitzPage } from "blitz";
import type { DragAndDropState } from "../contexts/gear-dnd-context";

import { useContext } from "react";

import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, IconButton } from "@chakra-ui/button";
import { HStack, Heading, Box, Flex, Stack } from "@chakra-ui/layout";
import { Menu, MenuButton } from "@chakra-ui/react";
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
  const { categoryMenu, addItemToCategory, readonly } =
    useContext(dragAndDropContext);

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
          px={2}
          border="3px solid"
          borderColor={snapshot.isDragging ? "blue" : "gray"}
          borderRadius="md"
          mx={2}
          width="270px"
          maxH="100%"
          direction="column"
        >
          <HStack
            {...provided.dragHandleProps}
            align="center"
            justify="space-between"
            px={1}
            py={3}
          >
            <Heading size="sm">{category.name}</Heading>
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
                  p={1}
                  width="100%"
                  bg={snapshot.isDraggingOver ? "blue" : "gray"}
                  borderRadius="md"
                >
                  <Stack>
                    {category.items.map((item, index) => (
                      <DraggableGear item={item} index={index} key={item.id} />
                    ))}

                    {provided.placeholder}
                  </Stack>
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
