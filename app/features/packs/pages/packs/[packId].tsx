import type { BlitzPage } from "blitz";
import type { DropResult } from "react-beautiful-dnd";
import type { PackCategory } from "db";

import { useMutation, useQuery, useRouter, Routes } from "blitz";
import { useEffect, useState } from "react";

import { MenuItem, MenuList } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaTshirt } from "react-icons/fa";

import FixedLayout from "app/common/layouts/fixed-layout";
import GearDnd from "app/modules/gear-dnd/components/gear-dnd";
import reorder from "app/modules/gear-dnd/helpers/reorder";
import reorderNested from "app/modules/gear-dnd/helpers/reorder-nested";
import Subheader from "app/common/components/subheader";
import ConfirmModal from "app/common/components/confirm-modal";

import PackCategoryForm from "../../components/pack-category-form";
import packQuery from "../../queries/pack-query";
import movePackCategoryMutation from "../../mutations/move-pack-category-mutation";
import PacksSubheaderContent from "../../components/packs-subheader-content";
import PackAddItemModal from "../../components/pack-add-item-modal";
import movePackGearMutation from "../../mutations/move-pack-gear-mutation";
import toggleWornMutation from "../../mutations/toggle-worn-mutation";
import deletePackCategoryMutation from "../../mutations/delete-pack-category-mutation";
import deletePackGearMutation from "../../mutations/delete-pack-gear-mutation";

const PackPage: BlitzPage = () => {
  const router = useRouter();

  const [addingCategory, setAddingCategory] = useState(false);
  const [editCategory, setEditCategory] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Pick<
    PackCategory,
    "name" | "id"
  > | null>(null);

  const [addItemToCategory, setAddItemToCategory] = useState<string | null>(
    null
  );
  const [deletingItem, setDeletingItem] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const [movePackCategory] = useMutation(movePackCategoryMutation);
  const [movePackGear] = useMutation(movePackGearMutation);

  const [toggleWorn] = useMutation(toggleWornMutation);

  const [deleteCategory] = useMutation(deletePackCategoryMutation);
  const [deleteGear] = useMutation(deletePackGearMutation);

  const [pack, { refetch }] = useQuery(packQuery, {
    id: router.query.packId as string,
  });

  const [dndState, setDndState] = useState(pack.categories);

  useEffect(() => {
    setDndState(pack.categories);
  }, [pack.categories]);

  const handleCategoryDrop = async (drop: DropResult) => {
    if (drop.destination) {
      setDndState((state) => {
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
      setDndState((state) => {
        if (!drop.destination) return state;
        return reorderNested({
          state,
          source: drop.source,
          destination: drop.destination,
        });
      });

      await movePackGear({
        id: drop.draggableId,
        packId: router.query.packId as string,
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
      <PackCategoryForm
        packId={pack.id}
        onSuccess={() => refetch()}
        isOpen={addingCategory || !!editCategory}
        categoryId={editCategory}
        onClose={() => {
          setAddingCategory(false);
          setEditCategory(null);
        }}
      />

      <PackAddItemModal
        packId={router.query.packId as string}
        categoryId={addItemToCategory}
        isOpen={!!addItemToCategory}
        onAdd={refetch}
        onClose={() => {
          setAddItemToCategory(null);
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
        description="Are you sure? This item will remain in your inventory or wish list where it is used."
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
        addItemToCategory={setAddItemToCategory}
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
            <MenuItem
              icon={<FaTrash />}
              onClick={() =>
                setDeletingItem({ id: item.id, name: item.gear.name })
              }
            >
              Delete item
            </MenuItem>
            <MenuItem
              icon={<FaTshirt />}
              onClick={async () => {
                await toggleWorn({ id: item.id });
                refetch();
              }}
            >
              {item.worn ? "Unmark as worn" : "Mark as worn"}
            </MenuItem>
          </MenuList>
        )}
      />
    </>
  );
};

PackPage.authenticate = { redirectTo: Routes.LoginPage() };
PackPage.getLayout = (page) => {
  return (
    <FixedLayout
      subheader={
        <Subheader>
          <PacksSubheaderContent />
        </Subheader>
      }
    >
      {page}
    </FixedLayout>
  );
};

export default PackPage;
