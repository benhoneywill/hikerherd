import type { BlitzPage } from "blitz";
import type { CategoryType, Category } from "db";
import type { DropResult } from "react-beautiful-dnd";

import { useMutation, useQuery } from "blitz";
import { useEffect, useState } from "react";

import { MenuItem, MenuList } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaUtensilSpoon } from "react-icons/fa";

import GearDnd from "app/modules/gear-dnd/components/gear-dnd";
import reorder from "app/modules/gear-dnd/helpers/reorder";
import reorderNested from "app/modules/gear-dnd/helpers/reorder-nested";
import ConfirmModal from "app/common/components/confirm-modal";

import gearOrganizerQuery from "../queries/gear-organizer-query";
import moveCategoryMutation from "../mutations/move-category-mutation";
import moveGearMutation from "../mutations/move-gear-mutation";
import deleteCategoryMutation from "../mutations/delete-category-mutation";
import toggleConsumableMutation from "../mutations/toggle-consumable-mutation";
import deleteGearMutation from "../mutations/delete-gear-mutation";

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
  const [deletingCategory, setDeletingCategory] = useState<Pick<
    Category,
    "name" | "id"
  > | null>(null);

  const [editItem, setEditItem] = useState<string | null>(null);
  const [addingItemToCategory, setAddingItemToCategory] = useState<
    string | null
  >(null);
  const [deletingItem, setDeletingItem] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const [moveCategory] = useMutation(moveCategoryMutation);
  const [moveGear] = useMutation(moveGearMutation);
  const [toggleConsumable] = useMutation(toggleConsumableMutation);

  const [deleteCategory] = useMutation(deleteCategoryMutation);
  const [deleteGear] = useMutation(deleteGearMutation);

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
        categoryId={addingItemToCategory}
        gearId={editItem}
        onSuccess={() => refetch()}
        isOpen={!!addingItemToCategory || !!editItem}
        onClose={() => {
          setEditItem(null);
          setAddingItemToCategory(null);
        }}
      />

      <ConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title={`You are about to delete "${deletingCategory?.name}"`}
        description="Are you sure?"
        onConfirm={async () => {
          if (deletingCategory) {
            await deleteCategory({ id: deletingCategory.id });
            refetch();
          }
        }}
      />

      <ConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title={`You are about to delete "${deletingItem?.name}"`}
        description="Are you sure? This item will remain in any pack lists where it is used."
        onConfirm={async () => {
          if (deletingItem) {
            await deleteGear({ id: deletingItem.id });
            refetch();
          }
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
            <MenuItem
              icon={<FaTrash />}
              onClick={() => setDeletingCategory(category)}
              isDisabled={category.items.length > 0}
            >
              Delete category
            </MenuItem>
          </MenuList>
        )}
        itemMenu={(item) => (
          <MenuList>
            <MenuItem icon={<FaEdit />} onClick={() => setEditItem(item.id)}>
              Edit item
            </MenuItem>
            <MenuItem
              icon={<FaTrash />}
              onClick={() =>
                setDeletingItem({ id: item.id, name: item.gear.name })
              }
            >
              Delete item
            </MenuItem>
            <MenuItem
              icon={<FaUtensilSpoon />}
              onClick={async () => {
                await toggleConsumable({ id: item.id });
                refetch();
              }}
            >
              {item.gear.consumable ? "Not consumable" : "Consumable"}
            </MenuItem>
          </MenuList>
        )}
      />
    </>
  );
};

export default GearOrganizer;
