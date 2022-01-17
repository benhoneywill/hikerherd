import type { BlitzPage } from "blitz";
import type { GearDndState } from "../contexts/gear-dnd-context";

import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, IconButton } from "@chakra-ui/button";
import { HStack, Heading, Box, Flex, Stack } from "@chakra-ui/layout";
import { Menu, MenuButton } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

import useModeColors from "app/common/hooks/use-mode-colors";

import useGearDnd from "../hooks/use-gear-dnd";

import DraggableGear from "./draggable-gear";

type DraggableCategoryProps = {
  category: GearDndState[number];
  index: number;
};

const DraggableCategory: BlitzPage<DraggableCategoryProps> = ({
  category,
  index,
}) => {
  const { vertical, categoryMenu, addItemToCategory } = useGearDnd();
  const { gray, blue } = useModeColors();

  return (
    <Draggable draggableId={category.id} index={index}>
      {(provided, snapshot) => (
        <Flex
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={provided.draggableProps.style}
          userSelect="none"
          px={2}
          bg={gray[50]}
          border="3px solid"
          borderColor={snapshot.isDragging ? "blue.400" : gray[50]}
          borderRadius="md"
          mx={vertical ? 0 : 2}
          mb={vertical ? 3 : 0}
          width={vertical ? "100%" : "270px"}
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
          </HStack>

          <Box overflowY="auto" mr="-8px" pr="8px">
            <Droppable type="item" droppableId={category.id}>
              {(provided, snapshot) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  p={1}
                  width="100%"
                  bg={snapshot.isDraggingOver ? blue[100] : gray[50]}
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
        </Flex>
      )}
    </Draggable>
  );
};

export default DraggableCategory;
