import type { BlitzPage } from "blitz";
import type { Gear } from "db";

import { useLayoutEffect, useState } from "react";

import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button, IconButton } from "@chakra-ui/button";
import { HStack, Heading, Box } from "@chakra-ui/layout";
import { FaEdit } from "react-icons/fa";

import GearCategoryForm from "./gear-category-form";
import DraggableGear from "./draggable-gear";
import GearForm from "./gear-form";

type DraggableGearCategoryProps = {
  category: {
    id: string;
    name: string;
    gear: Gear[];
  };
  index: number;
  itemType: string;
  vertical?: boolean;
  rejectItemIdPrefix?: string;
  itemIdPrefix?: string;
  draggingIdPrefix?: string | null;
};

const DraggableGearCategory: BlitzPage<DraggableGearCategoryProps> = ({
  category: categoryProp,
  itemType,
  index,
  vertical = false,
  rejectItemIdPrefix,
  draggingIdPrefix,
  itemIdPrefix,
}) => {
  const [category, setCategory] = useState(categoryProp);

  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);

  useLayoutEffect(() => {
    setCategory(categoryProp);
  }, [categoryProp]);

  return (
    <>
      <GearCategoryForm
        isOpen={!!editing}
        category={category}
        onSuccess={(category) =>
          setCategory((state) => ({ ...state, ...category }))
        }
        onClose={() => setEditing(false)}
      />

      <GearForm
        isOpen={!!adding}
        categoryId={category.id}
        onSuccess={(gear) =>
          setCategory((state) => ({
            ...state,
            gear: [...state.gear, gear],
          }))
        }
        onClose={() => setAdding(false)}
      />

      <Draggable draggableId={category.id} index={index}>
        {(provided, snapshot) => (
          <Box
            {...provided.draggableProps}
            ref={provided.innerRef}
            style={provided.draggableProps.style}
            userSelect="none"
            padding={2}
            bg="gray.200"
            border="3px solid"
            borderColor={snapshot.isDragging ? "blue.400" : "gray.200"}
            borderRadius="md"
            mx={vertical ? 0 : 2}
            mb={vertical ? 3 : 0}
            width="270px"
          >
            <HStack {...provided.dragHandleProps} align="center" p={1} pb={3}>
              <IconButton
                icon={<FaEdit />}
                onClick={() => setEditing(true)}
                aria-label="edit category"
                size="xs"
              />
              <Heading size="sm">{category.name}</Heading>
            </HStack>

            <Droppable
              type={itemType}
              droppableId={
                itemIdPrefix ? `${itemIdPrefix}|${category.id}` : category.id
              }
              isDropDisabled={
                !!draggingIdPrefix &&
                !!rejectItemIdPrefix &&
                draggingIdPrefix === rejectItemIdPrefix
              }
            >
              {(provided, snapshot) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  p={1}
                  width="100%"
                  minHeight="50px"
                  bg={snapshot.isDraggingOver ? "blue.100" : "gray.200"}
                  borderRadius="md"
                >
                  {category.gear.map((gear, index) => (
                    <DraggableGear
                      gear={gear}
                      index={index}
                      key={gear.id}
                      itemIdPrefix={itemIdPrefix}
                    />
                  ))}

                  {provided.placeholder}
                </Box>
              )}
            </Droppable>

            <Box p={1} mt={2}>
              <Button
                w="100%"
                size="sm"
                onClick={() => setAdding(true)}
                colorScheme="green"
              >
                Add
              </Button>
            </Box>
          </Box>
        )}
      </Draggable>
    </>
  );
};

export default DraggableGearCategory;
