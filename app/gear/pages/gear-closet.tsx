import type { DropResult } from "react-beautiful-dnd";
import type { GearClosetResult } from "../queries/gear-closet-query";
import type { BlitzPage } from "blitz";

import { useMutation, useQuery } from "blitz";
import { useEffect, useState } from "react";

import { DragDropContext } from "react-beautiful-dnd";

import FullWidthLayout from "app/common/layouts/full-width-layout";

import gearClosetQuery from "../queries/gear-closet-query";
import moveGearMutation from "../mutations/move-gear-mutation";
import moveCategoryMutation from "../mutations/move-category-mutation";
import DraggableGearList from "../components/draggable-gear-organizer";
import reorder from "../helpers/reorder";

const GearClosetPage: BlitzPage = () => {
  const [moveGear] = useMutation(moveGearMutation);
  const [moveCategory] = useMutation(moveCategoryMutation);

  const [dragState, setDragState] = useState<GearClosetResult>([]);

  const [gear, { refetch }] = useQuery(gearClosetQuery, {});

  useEffect(() => {
    setDragState(gear);
  }, [gear]);

  const handleCategoryDrop = async ({
    destination,
    draggableId,
    source,
  }: DropResult) => {
    if (!destination) return;

    setDragState((state) => {
      return reorder({
        state,
        from: source.index,
        to: destination.index,
      });
    });

    await moveCategory({
      id: draggableId,
      index: destination?.index || 0,
    });

    await refetch();
  };

  const handleGearDrop = async ({
    destination,
    draggableId,
    source,
  }: DropResult) => {
    if (!destination) return;

    setDragState((state) => {
      const fromCat = state.find((cat) => cat.id === source.droppableId);
      const toCat = state.find((cat) => cat.id === destination.droppableId);

      if (!fromCat || !toCat) return state;

      const item = fromCat.gear[source.index];

      if (!item) return state;

      fromCat.gear = reorder({
        state: fromCat.gear,
        from: source.index,
      });

      toCat.gear = reorder({
        state: toCat.gear,
        to: destination.index,
        item,
      });

      return state.map((cat) => {
        if (cat.id === toCat.id) {
          return toCat;
        }

        if (cat.id === fromCat.id) {
          return fromCat;
        }

        return cat;
      });
    });

    await moveGear({
      id: draggableId,
      categoryId: destination?.droppableId,
      index: destination?.index || 0,
    });

    refetch();
  };

  const handleDrop = async (drop: DropResult) => {
    if (drop.type === "category") {
      await handleCategoryDrop(drop);
    }

    if (drop.type === "item") {
      await handleGearDrop(drop);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <DraggableGearList
        categories={dragState}
        categoryType="category"
        itemType="item"
      />
    </DragDropContext>
  );
};

GearClosetPage.getLayout = (page) => (
  <FullWidthLayout padless>{page}</FullWidthLayout>
);

export default GearClosetPage;
