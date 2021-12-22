import type { DropResult } from "react-beautiful-dnd";
import type { GearResult } from "../queries/gear-query";
import type { BlitzPage } from "blitz";

import { useMutation, useQuery } from "blitz";
import { useEffect, useState } from "react";

import { DragDropContext } from "react-beautiful-dnd";

import FullWidthLayout from "app/common/layouts/full-width-layout";

import gearQuery from "../queries/gear-query";
import moveGearMutation from "../mutations/move-gear-mutation";
import moveCategoryMutation from "../mutations/move-category-mutation";
import DraggableGearList from "../components/draggable-gear-list";

type ReorderOptions<T> = {
  state: Array<T>;
  from?: number;
  to?: number;
  item?: T;
};

const reorder = <T extends any>({
  state,
  from,
  to,
  item,
}: ReorderOptions<T>) => {
  const newState = [...state];
  if (from || from === 0) newState.splice(from, 1);
  if (to || to === 0) {
    if (item) newState.splice(to, 0, item);
    else if (from || from === 0) {
      const element = state[from];
      if (element) {
        newState.splice(to, 0, element);
      }
    }
  }
  return newState;
};

const GearClosetPage: BlitzPage = () => {
  const [moveGear] = useMutation(moveGearMutation);
  const [moveCategory] = useMutation(moveCategoryMutation);

  const [dragState, setDragState] = useState<GearResult>([]);

  const [gear, { refetch }] = useQuery(gearQuery, {});

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
