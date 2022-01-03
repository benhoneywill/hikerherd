import type { BlitzPage } from "blitz";
import type { CategoryType } from "db";
import type { DropResult } from "react-beautiful-dnd";

import { useMutation, useQuery } from "blitz";
import { useEffect, useState } from "react";

import { MenuItem, MenuList } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

import GearDnd from "app/modules/gear-dnd/components/gear-dnd";
import reorder from "app/modules/gear-dnd/helpers/reorder";
import reorderNested from "app/modules/gear-dnd/helpers/reorder-nested";

import gearOrganizerQuery from "../queries/gear-organizer-query";
import moveCategoryMutation from "../mutations/move-category-mutation";
import moveGearMutation from "../mutations/move-gear-mutation";

import CategoryForm from "./category-form";
import GearForm from "./gear-form";

type GearOrganizerProps = {
  type: CategoryType;
};

const GearOrganizer: BlitzPage<GearOrganizerProps> = ({ type }) => {
  const [data, { refetch }] = useQuery(gearOrganizerQuery, { type });
  const [dndState, setDndState] = useState(data);

  const [addingCategory, setAddingCategory] = useState(false);
  const [editCategory, setEditCategory] = useState<string | null>(null);

  const [addingItemToCategory, setAddingItemToCategory] = useState<
    string | null
  >(null);
  const [editItem, setEditItem] = useState<string | null>(null);

  const [moveCategory] = useMutation(moveCategoryMutation);
  const [moveGear] = useMutation(moveGearMutation);

  useEffect(() => {
    setDndState(data);
  }, [data]);

  const handleCategoryDrop = async (drop: DropResult) => {
    if (drop.destination) {
      setDndState((state) => {
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

      await refetch();
    }
  };

  const handleItemDrop = async (drop: DropResult) => {
    if (drop.destination) {
      setDndState((state) => {
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
    <>
      <CategoryForm
        type={type}
        onSuccess={() => refetch()}
        isOpen={addingCategory || !!editCategory}
        categoryId={editCategory}
        onClose={() => {
          setAddingCategory(false);
          setEditCategory(null);
        }}
      />

      <GearForm
        type={type}
        gearId={editItem}
        categoryId={addingItemToCategory}
        onSuccess={() => refetch()}
        isOpen={!!addingItemToCategory || !!editItem}
        onClose={() => {
          setAddingItemToCategory(null);
          setEditItem(null);
        }}
      />

      <GearDnd
        handleDrop={handleDrop}
        state={dndState}
        vertical={false}
        addCategory={() => setAddingCategory(true)}
        addItemToCategory={setAddingItemToCategory}
        categoryMenu={(category) => (
          <MenuList>
            <MenuItem
              icon={<FaEdit />}
              onClick={() => setEditCategory(category.id)}
            >
              Edit category
            </MenuItem>
          </MenuList>
        )}
        itemMenu={(item) => (
          <MenuList>
            <MenuItem icon={<FaEdit />} onClick={() => setEditItem(item.id)}>
              Edit item
            </MenuItem>
          </MenuList>
        )}
      />
    </>
  );
};

export default GearOrganizer;
