import type { DropResult } from "react-beautiful-dnd";
import type { GearClosetResult } from "../../queries/gear-closet-query";
import type { BlitzPage } from "blitz";

import { useRouter, useMutation, useQuery } from "blitz";
import { useEffect, useState } from "react";

import { DragDropContext } from "react-beautiful-dnd";
import { Box, HStack } from "@chakra-ui/layout";

import FullWidthLayout from "app/common/layouts/full-width-layout";

import gearClosetQuery from "../../queries/gear-closet-query";
import gearListQuery from "../../queries/gear-list-query";
import moveGearMutation from "../../mutations/move-gear-mutation";
import moveCategoryMutation from "../../mutations/move-category-mutation";
import DraggableGearList from "../../components/draggable-gear-organizer";
import reorder from "../../helpers/reorder";

const GearListPage: BlitzPage = () => {
  const router = useRouter();

  const [moveClosetGear] = useMutation(moveGearMutation);
  const [moveClosetCategory] = useMutation(moveCategoryMutation);

  const [draggingIdPrefix, setDraggingIdPrefix] = useState<string | null>(null);
  const [closetDragState, setClosetDragState] = useState<GearClosetResult>([]);
  const [dragState, setDragState] = useState<GearClosetResult>([]);

  const [gearCloset, { refetch: refetchCloset }] = useQuery(
    gearClosetQuery,
    {}
  );
  const [gear] = useQuery(gearListQuery, {
    id: router.query.id as string,
  });

  useEffect(() => {
    setDragState([
      {
        name: "Fake",
        id: "123abc",
        index: 0,
        gear: [
          {
            name: "Thing",
            id: "abc123",
            weight: 300,
            index: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            ownerId: "123",
            categoryId: "123abc",
          },
        ],
      },
    ]);
  }, [gear]);

  useEffect(() => {
    setClosetDragState(gearCloset);
  }, [gearCloset]);

  const handleClosetCategoryDrop = async ({
    destination,
    draggableId,
    source,
  }: DropResult) => {
    if (!destination) return;

    setClosetDragState((state) => {
      return reorder({
        state,
        from: source.index,
        to: destination.index,
      });
    });

    await moveClosetCategory({
      id: draggableId,
      index: destination?.index || 0,
    });

    await refetchCloset();
  };

  const handleClosetGearDrop = async ({
    destination,
    draggableId,
    source,
  }: DropResult) => {
    if (!destination) return;

    setClosetDragState((state) => {
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

    await moveClosetGear({
      id: draggableId,
      categoryId: destination?.droppableId,
      index: destination?.index || 0,
    });

    refetchCloset();
  };

  const handleDrop = async (drop: DropResult) => {
    setDraggingIdPrefix(null);

    if (drop.type === "closet_category") {
      await handleClosetCategoryDrop(drop);
    }

    if (drop.type === "list_category") {
      console.log("Handle list category drop");
    }

    if (drop.type === "item") {
      const itemPrefix = drop.draggableId.includes("|")
        ? drop.draggableId.split("|")[0] || null
        : null;

      const destinationPrefix = drop.destination?.droppableId.includes("|")
        ? drop.destination?.droppableId.split("|")[0] || null
        : null;

      if (!itemPrefix && !destinationPrefix) {
        return await handleClosetGearDrop(drop);
      }

      if (itemPrefix === "list" && itemPrefix === destinationPrefix) {
        console.log("move the gear list item");
        return;
      }

      if (destinationPrefix === "list") {
        console.log("create new gear list item from closet item");
        return;
      }
    }
  };

  return (
    <DragDropContext
      onDragEnd={handleDrop}
      onBeforeCapture={({ draggableId }) =>
        setDraggingIdPrefix(
          draggableId.includes("|") ? draggableId.split("|")[0] || null : null
        )
      }
    >
      <HStack align="start">
        <Box border="1px solid" borderColor="gray.500">
          <DraggableGearList
            categories={closetDragState}
            categoryType="closet_category"
            itemType="item"
            vertical
            rejectItemIdPrefix="list"
            draggingIdPrefix={draggingIdPrefix}
          />
        </Box>
        <DraggableGearList
          categories={dragState}
          categoryType="list_category"
          itemType="item"
          itemIdPrefix="list"
        />
      </HStack>
    </DragDropContext>
  );
};

GearListPage.getLayout = (page) => (
  <FullWidthLayout padless>{page}</FullWidthLayout>
);

export default GearListPage;
