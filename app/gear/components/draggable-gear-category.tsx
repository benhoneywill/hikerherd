import type { BlitzPage } from "blitz";
import type { GearCategory, Gear } from "db";

import { useLayoutEffect, useMemo, useState } from "react";

import { Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";

import GearCategoryForm from "./gear-category-form";
import DraggableGear from "./draggable-gear";
import GearForm from "./gear-form";

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
  width: 250,
});

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 2,
  margin: `0 ${8}px`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

type DraggableGearCategoryProps = {
  category: Pick<GearCategory, "id" | "name"> & { gear: { gear: Gear }[] };
  index: number;
  itemType: string;
};

const DraggableGearCategory: BlitzPage<DraggableGearCategoryProps> = ({
  category: categoryProp,
  itemType,
  index,
}) => {
  const [category, setCategory] = useState(categoryProp);
  const gear = useMemo(
    () => category.gear.map((gearCategory) => gearCategory.gear),
    [category.gear]
  );

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
            gear: [...state.gear, { gear }],
          }))
        }
        onClose={() => setAdding(false)}
      />

      <Draggable draggableId={category.id} index={index}>
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
            ref={provided.innerRef}
          >
            <HStack {...provided.dragHandleProps}>
              <h2>{category.name}</h2>
              <Button onClick={() => setEditing(true)} size="xs">
                Edit
              </Button>
            </HStack>

            <Droppable type={itemType} droppableId={category.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {gear.map((gear, index) => (
                    <DraggableGear gear={gear} index={index} key={gear.id} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Button onClick={() => setAdding(true)}>Add</Button>
          </div>
        )}
      </Draggable>
    </>
  );
};

export default DraggableGearCategory;
