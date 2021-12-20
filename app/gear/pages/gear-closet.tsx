import type { BlitzPage } from "blitz";
import type { Gear, GearCategory } from "db";
import type { DropResult } from "react-beautiful-dnd";
import type { GearResult } from "../queries/gear-query";

import { useMutation, useQuery } from "blitz";
import { useEffect, useState } from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@chakra-ui/button";
import { HStack } from "@chakra-ui/layout";

import FullWidthLayout from "app/common/layouts/full-width-layout";

import gearQuery from "../queries/gear-query";
import GearForm from "../components/gear-form";
import GearCategoryForm from "../components/gear-category-form";
import moveGearMutation from "../mutations/move-gear-mutation";

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 8 * 2,
  margin: `0 0 ${8}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  minHeight: "300px",
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
  width: 250,
});

const GearClosetPage: BlitzPage = () => {
  const [moveGear] = useMutation(moveGearMutation);

  const [dragState, setDragState] = useState<GearResult>([]);

  const [creatingCategory, setCreatingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Pick<GearCategory, "name" | "id"> | undefined
  >(undefined);
  const [addingToCategory, setAddingToCategory] = useState<string | undefined>(
    undefined
  );
  const [editing, setEditing] = useState<Gear | undefined>(undefined);
  const [gear, { refetch }] = useQuery(gearQuery, {});

  useEffect(() => {
    setDragState(gear);
  }, [gear]);

  const handleDrop = async ({
    destination,
    draggableId,
    source,
  }: DropResult) => {
    if (!destination) {
      return;
    }

    setDragState((state) => {
      const newState = state.map((category) => {
        const newCategoryState = { ...category };

        if (
          source.droppableId === category.id &&
          destination.droppableId === category.id
        ) {
          const index = category.gear.findIndex(
            (g) => g.gear.id === draggableId
          );
          const item = category.gear[index] as any;
          const gear = [...category.gear];
          gear.splice(index, 1);
          gear.splice(destination.index, 0, item);

          return {
            ...category,
            gear,
          };
        }

        if (source.droppableId === category.id) {
          return {
            ...category,
            gear: category.gear
              .slice(0, source.index)
              .concat(newCategoryState.gear.slice(source.index + 1)),
          };
        }

        if (destination.droppableId === category.id) {
          const item = state
            .find((cat) => cat.id === source.droppableId)
            ?.gear.find((g) => g.gear.id === draggableId);

          return {
            ...category,
            gear: category.gear
              .slice(0, destination.index)
              .concat(item || [])
              .concat(newCategoryState.gear.slice(destination.index)),
          };
        }

        return category;
      });

      console.log(newState);

      return newState;
    });

    await moveGear({
      id: draggableId,
      categoryId:
        destination?.droppableId === "ungrouped"
          ? null
          : destination?.droppableId,
      index: destination?.index || 0,
    });

    refetch();
  };

  return (
    <div>
      <GearForm
        isOpen={!!addingToCategory || !!editing}
        categoryId={
          addingToCategory === "ungrouped" ? undefined : addingToCategory
        }
        gear={editing}
        onSuccess={() => refetch()}
        onClose={() => {
          setAddingToCategory(undefined);
          setEditing(undefined);
        }}
      />

      <GearCategoryForm
        isOpen={!!creatingCategory || !!editingCategory}
        category={editingCategory}
        onSuccess={() => refetch()}
        onClose={() => {
          setCreatingCategory(false);
          setEditingCategory(undefined);
        }}
      />

      <DragDropContext onDragEnd={handleDrop}>
        <HStack spacing={10} align="start" overflowX="auto">
          {dragState.map((category) => (
            <div key={category.id}>
              <HStack>
                <h2>{category.name}</h2>
                {category.id !== "ungrouped" && (
                  <Button
                    onClick={() =>
                      setEditingCategory({
                        name: category.name,
                        id: category.id,
                      })
                    }
                    size="xs"
                  >
                    Edit category
                  </Button>
                )}
              </HStack>

              <Droppable droppableId={category.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {category.gear?.map((gear, index) => (
                      <Draggable
                        draggableId={gear.gear.id}
                        index={index}
                        key={gear.gear.id}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <p>{gear.gear.name}</p>
                            <Button
                              size="xs"
                              onClick={() => setEditing(gear.gear)}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Button onClick={() => setAddingToCategory(category.id)}>
                Add
              </Button>
            </div>
          ))}

          <Button onClick={() => setCreatingCategory(true)}>
            New category
          </Button>
        </HStack>
      </DragDropContext>
    </div>
  );
};

GearClosetPage.getLayout = (page) => <FullWidthLayout>{page}</FullWidthLayout>;

export default GearClosetPage;
