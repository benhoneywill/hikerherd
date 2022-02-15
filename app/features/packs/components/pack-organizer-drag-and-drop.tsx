import type { DropResult } from "react-beautiful-dnd";
import type { FC } from "react";

import { useContext } from "react";
import { useMutation } from "blitz";

import reorder from "app/modules/drag-and-drop/helpers/reorder";
import reorderNested from "app/modules/drag-and-drop/helpers/reorder-nested";
import DragAndDrop from "app/modules/drag-and-drop/components/drag-and-drop";
import gearOrganizerContext from "app/features/inventory/contexts/gear-organizer-context";
import movePackCategoryMutation from "app/features/pack-categories/mutations/move-pack-category-mutation";
import movePackGearMutation from "app/features/pack-gear/mutations/move-pack-gear-mutation";

import PackOrganizerItemMenu from "./pack-organizer-item-menu";
import PackOrganizerCategoryMenu from "./pack-organizer-category-menu";

const PackOrganizerDragAndDrop: FC = () => {
  const {
    state,
    setState,
    refetch,
    addCategory,
    addItemToCategory,
    editCategory,
    editItem,
  } = useContext(gearOrganizerContext);

  const [movePackCategory] = useMutation(movePackCategoryMutation);
  const [movePackGear] = useMutation(movePackGearMutation);

  const handleCategoryDrop = async (drop: DropResult) => {
    if (drop.destination) {
      setState((state) => {
        return reorder({
          state,
          from: drop.source.index,
          to: drop.destination?.index,
        });
      });

      await movePackCategory({
        id: drop.draggableId,
        index: drop.destination.index,
      });

      await refetch();
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

      await movePackGear({
        id: drop.draggableId,
        categoryId: drop.destination.droppableId,
        index: drop.destination.index,
      });

      refetch();
    }
  };

  const handleDrop = async (drop: DropResult) => {
    if (drop.type === "category") {
      await handleCategoryDrop(drop);
    }

    if (drop.type === "item") {
      await handleItemDrop(drop);
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
      categoryMenu={(category) => (
        <PackOrganizerCategoryMenu category={category} />
      )}
      itemMenu={(item) => <PackOrganizerItemMenu item={item} />}
    />
  );
};

export default PackOrganizerDragAndDrop;
