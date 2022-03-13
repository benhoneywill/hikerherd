import type { FC } from "react";
import type { DropResult } from "react-beautiful-dnd";
import type { CategoryType } from "db";

import { useContext } from "react";
import { useMutation } from "blitz";

import { useToast } from "@chakra-ui/react";

import DragAndDrop from "app/components/drag-and-drop/components/drag-and-drop";
import reorder from "app/components/drag-and-drop/helpers/reorder";
import reorderNested from "app/components/drag-and-drop/helpers/reorder-nested";
import moveCategoryMutation from "app/apps/categories/mutations/move-category-mutation";
import moveCategoryGearMutation from "app/apps/category-gear/mutations/move-category-gear-mutation";

import gearOrganizerContext from "../contexts/gear-organizer-context";

import GearOrganizerCategoryMenu from "./gear-organizer-category-menu";
import GearOrganizerItemMenu from "./gear-organizer-item-menu";

type GearOrganizerDragAndDropProps = {
  type: CategoryType;
};

const GearOrganizerDragAndDrop: FC<GearOrganizerDragAndDropProps> = ({
  type,
}) => {
  const {
    state,
    setState,
    refetch,
    addCategory,
    addItemToCategory,
    editCategory,
    editItem,
  } = useContext(gearOrganizerContext);
  const toast = useToast();

  const [moveCategory] = useMutation(moveCategoryMutation);
  const [moveGear] = useMutation(moveCategoryGearMutation);

  const handleCategoryDrop = async (drop: DropResult) => {
    if (drop.destination) {
      setState((state) => {
        return reorder({
          state,
          from: drop.source.index,
          to: drop.destination?.index,
        });
      });

      await moveCategory({
        id: drop.draggableId,
        index: drop.destination.index,
      });
    }
  };

  const handleItemDrop = async (drop: DropResult) => {
    if (drop.destination) {
      setState((state) => {
        if (!drop.destination) return state;
        return reorderNested({
          state,
          source: drop.source,
          destination: drop.destination,
        });
      });

      await moveGear({
        id: drop.draggableId,
        categoryId: drop.destination.droppableId,
        index: drop.destination.index,
      });
    }
  };

  const handleDrop = async (drop: DropResult) => {
    try {
      if (drop.type === "category") {
        await handleCategoryDrop(drop);
      }

      if (drop.type === "item") {
        await handleItemDrop(drop);
      }
    } catch (err) {
      refetch();
      toast({
        title: "Something went wrong",
        description: "There was a problem moving that item.",
        status: "error",
      });
    }
  };

  return (
    <DragAndDrop
      handleDrop={handleDrop}
      state={state}
      addCategory={addCategory}
      editCategory={editCategory}
      addItemToCategory={addItemToCategory}
      editItem={editItem}
      hideCategoryTotals
      categoryMenu={(category) => (
        <GearOrganizerCategoryMenu category={category} />
      )}
      itemMenu={(item) => <GearOrganizerItemMenu type={type} item={item} />}
    />
  );
};

export default GearOrganizerDragAndDrop;
