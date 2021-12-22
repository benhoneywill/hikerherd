import type { BlitzPage } from "blitz";
import type { Gear, GearCategory } from "db";

import { useLayoutEffect, useState } from "react";

import { Droppable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";
import { Stack } from "@chakra-ui/layout";

import GearCategoryForm from "../components/gear-category-form";
import DraggableGearCategory from "../components/draggable-gear-category";

const getCatListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  width: "100%",
});

type DraggableGearListProps = {
  categories: Array<
    Pick<GearCategory, "id" | "name"> & { gear: { gear: Gear }[] }
  >;
  vertical?: boolean;
  categoryType: string;
  itemType: string;
};

const DraggableGearList: BlitzPage<DraggableGearListProps> = ({
  vertical = false,
  categories: categoriesProp,
  categoryType,
  itemType,
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
          setCategories((state) => [...state, { ...category, gear: [] }])
        }
        onClose={() => setCreatingCategory(false)}
      />

      <Droppable
        droppableId="category"
        type={categoryType}
        direction={vertical ? "vertical" : "horizontal"}
      >
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getCatListStyle(snapshot.isDraggingOver)}
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
                    category={category}
                    index={index}
                    itemType={itemType}
                  />
                </div>
              ))}

              {provided.placeholder}

              <div>
                <Button onClick={() => setCreatingCategory(true)}>
                  New category
                </Button>
              </div>
            </Stack>
          </div>
        )}
      </Droppable>
    </>
  );
};

export default DraggableGearList;
