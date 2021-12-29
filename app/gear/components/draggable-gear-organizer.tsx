import type { BlitzPage } from "blitz";
import type { Gear } from "db";

import { useLayoutEffect, useState } from "react";

import { Droppable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";
import { Stack, Box } from "@chakra-ui/layout";

import GearCategoryForm from "./gear-category-form";
import DraggableGearCategory from "./draggable-gear-category";

type DraggableGearOrganizerProps = {
  categories: {
    id: string;
    name: string;
    gear: Gear[];
  }[];
  vertical?: boolean;
  categoryType: string;
  itemType: string;
  rejectItemIdPrefix?: string;
  itemIdPrefix?: string;
  draggingIdPrefix?: string | null;
};

const DraggableGearOrganizer: BlitzPage<DraggableGearOrganizerProps> = ({
  vertical = false,
  categories: categoriesProp,
  categoryType,
  itemType,
  rejectItemIdPrefix,
  itemIdPrefix,
  draggingIdPrefix,
}) => {
  const [categories, setCategories] = useState(categoriesProp);
  const [creatingCategory, setCreatingCategory] = useState(false);

  useLayoutEffect(() => {
    setCategories(categoriesProp);
  }, [categoriesProp]);

  return (
    <>
      <GearCategoryForm
        isOpen={!!creatingCategory}
        onSuccess={(category) =>
          setCategories((state) => [
            ...state,
            { ...category, gear: [], weight: 0 },
          ])
        }
        onClose={() => setCreatingCategory(false)}
      />

      <Droppable
        droppableId={categoryType}
        type={categoryType}
        direction={vertical ? "vertical" : "horizontal"}
      >
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            bg={snapshot.isDraggingOver ? "blue.50" : "gray.50"}
            width="100%"
            height="100%"
          >
            <Stack
              spacing={0}
              align="start"
              overflowX="auto"
              direction={vertical ? "column" : "row"}
              p={4}
            >
              {categories.map((category, index) => (
                <div key={category.id}>
                  <DraggableGearCategory
                    vertical={vertical}
                    category={category}
                    index={index}
                    itemType={itemType}
                    rejectItemIdPrefix={rejectItemIdPrefix}
                    itemIdPrefix={itemIdPrefix}
                    draggingIdPrefix={draggingIdPrefix}
                  />
                </div>
              ))}

              {provided.placeholder}

              <div>
                <Box
                  w="270px"
                  padding={2}
                  bg="gray.200"
                  borderRadius="md"
                  mx={vertical ? 0 : 1}
                >
                  <Button
                    isFullWidth
                    size="sm"
                    colorScheme="blue"
                    onClick={() => setCreatingCategory(true)}
                  >
                    New category
                  </Button>
                </Box>
              </div>
            </Stack>
          </Box>
        )}
      </Droppable>
    </>
  );
};

export default DraggableGearOrganizer;
