import type { BlitzPage } from "blitz";
import type { DragAndDropState } from "../contexts/gear-dnd-context";
import type { DraggableProvided } from "react-beautiful-dnd";

import { useContext, useMemo } from "react";

import { Button, IconButton } from "@chakra-ui/button";
import { Tag, TagLabel } from "@chakra-ui/tag";
import { HStack, Heading, Box, Flex } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";
import { Menu, MenuButton } from "@chakra-ui/menu";
import { BsThreeDotsVertical } from "react-icons/bs";

import displayWeight from "app/helpers/display-weight";
import userPreferencesContext from "app/apps/users/contexts/user-preferences-context";

import dragAndDropContext from "../contexts/gear-dnd-context";

import GearDropZone from "./gear-drop-zone";

type CategoryProps = {
  category: DragAndDropState[number] & { weight: number };
  provided: DraggableProvided;
  isDragging: boolean;
};

const Category: BlitzPage<CategoryProps> = ({
  category,
  isDragging,
  provided,
}) => {
  const { categoryMenu, addItemToCategory, editCategory, hideCategoryTotals } =
    useContext(dragAndDropContext);
  const { weightUnit, compact } = useContext(userPreferencesContext);

  const bg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const borderWidth = useColorModeValue("2px", "1px");

  const menu = useMemo(() => {
    return categoryMenu && categoryMenu(category);
  }, [category]); // eslint-disable-line

  return (
    <Flex
      {...provided.draggableProps}
      key={category.id}
      ref={provided.innerRef}
      style={provided.draggableProps.style}
      userSelect="none"
      pointerEvents="all"
      px={2}
      pb={2}
      borderStyle="solid"
      borderWidth={borderWidth}
      bg={bg}
      borderColor={isDragging ? "blue.400" : borderColor}
      borderRadius="md"
      mx={compact ? 0 : 2}
      my={compact ? 2 : 0}
      width={compact ? "100%" : "290px"}
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
          noOfLines={2}
        >
          {category.name}
        </Heading>

        <HStack>
          {!hideCategoryTotals && (
            <Tag colorScheme="teal" size="sm">
              <TagLabel>
                {displayWeight(category.weight, weightUnit, true)}
              </TagLabel>
            </Tag>
          )}
          {categoryMenu && (
            <Menu isLazy>
              <MenuButton
                as={IconButton}
                borderRadius="full"
                icon={<BsThreeDotsVertical />}
                size="xs"
                aria-label="actions"
              />
              {menu}
            </Menu>
          )}
        </HStack>
      </HStack>

      <GearDropZone droppableId={category.id} items={category.items} />

      {addItemToCategory && (
        <Box p={1}>
          <Button
            isFullWidth
            size="sm"
            onClick={() => addItemToCategory(category.id)}
            colorScheme="blue"
            variant={compact ? "outline" : "solid"}
            height={compact ? "40px" : undefined}
          >
            Add
          </Button>
        </Box>
      )}
    </Flex>
  );
};

export default Category;
