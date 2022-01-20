import type { BlitzPage } from "blitz";
import type { CategoryType, Category, CategoryItem } from "db";
import type { DropResult } from "react-beautiful-dnd";

import { useMutation, useQuery } from "blitz";
import { useEffect, useState } from "react";

import { MenuItem, MenuList } from "@chakra-ui/react";
import { FaEdit, FaList, FaStar, FaTrash, FaHamburger } from "react-icons/fa";

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
import MoveBetweenWishListForm from "./move-between-wish-list-form";
import AddItemToCategory from "./add-item-to-category";

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

  const [movingItemBetween, setMovingItemBetween] = useState<
    (CategoryItem & { gear: { name: string } }) | null
  >(null);

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
        gearId={editItem}
        onSuccess={() => refetch()}
        isOpen={!!editItem}
        onClose={() => {
          setEditItem(null);
        }}
      />

      <AddItemToCategory
        categoryId={addingItemToCategory}
        isOpen={!!addingItemToCategory}
        onClose={() => setAddingItemToCategory(null)}
        onAdd={() => refetch()}
        type={type}
      />

      <ConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Delete this category"
        description={`You are about to delete '${deletingCategory?.name}'. Are you sure?`}
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
        title="Delete this gear"
        description={`You are about to delete '${deletingItem?.name}'. Are your sure? The gear will remain in any packs which use it but it will otherwise be lost.`}
        onConfirm={async () => {
          if (deletingItem) {
            await deleteGear({ id: deletingItem.id });
            refetch();
          }
        }}
      />

      <MoveBetweenWishListForm
        type={type === "INVENTORY" ? "WISH_LIST" : "INVENTORY"}
        item={movingItemBetween}
        onSuccess={() => refetch()}
        isOpen={!!movingItemBetween}
        onClose={() => setMovingItemBetween(null)}
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
              icon={<FaHamburger />}
              onClick={async () => {
                await toggleConsumable({ id: item.id });
                refetch();
              }}
            >
              {item.gear.consumable ? "Not consumable" : "Consumable"}
            </MenuItem>
            {type === "WISH_LIST" && (
              <MenuItem
                icon={<FaList />}
                onClick={() => setMovingItemBetween(item)}
              >
                Move to inventory
              </MenuItem>
            )}
            {type === "INVENTORY" && (
              <MenuItem
                icon={<FaStar />}
                onClick={() => setMovingItemBetween(item)}
              >
                Move to wish list
              </MenuItem>
            )}
          </MenuList>
        )}
      />
    </>
  );
};

export default GearOrganizer;
