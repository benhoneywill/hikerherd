import type { FC } from "react";
import type { DropResult } from "react-beautiful-dnd";

import { useContext } from "react";
import { useMutation } from "blitz";

import DragAndDrop from "app/modules/drag-and-drop/components/drag-and-drop";
import reorder from "app/modules/drag-and-drop/helpers/reorder";
import reorderNested from "app/modules/drag-and-drop/helpers/reorder-nested";
import moveCategoryMutation from "app/features/categories/mutations/move-category-mutation";
import moveCategoryGearMutation from "app/features/category-gear/mutations/move-category-gear-mutation";

import gearOrganizerContext from "../contexts/gear-organizer-context";

import GearOrganizerCategoryMenu from "./gear-organizer-category-menu";
import GearOrganizerItemMenu from "./gear-organizer-item-menu";

const GearOrganizerDragAndDrop: FC = () => {
  const { state, setState, refetch, addCategory, addItemToCategory } =
    useContext(gearOrganizerContext);

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
    if (drop.type === "category") {
      await handleCategoryDrop(drop);
    }

    if (drop.type === "item") {
      await handleItemDrop(drop);
    }

    refetch();
  };

  return (
    <DragAndDrop
      handleDrop={handleDrop}
      state={state}
      addCategory={addCategory}
      addItemToCategory={addItemToCategory}
      categoryMenu={(category) => (
        <GearOrganizerCategoryMenu category={category} />
      )}
      itemMenu={(item) => <GearOrganizerItemMenu item={item} />}
    />
  );
};

export default GearOrganizerDragAndDrop;
