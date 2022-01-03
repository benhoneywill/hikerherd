import type { BlitzPage } from "blitz";
import type { DropResult } from "react-beautiful-dnd";

import { useMutation, useQuery, useRouter, Routes } from "blitz";
import { useEffect, useState } from "react";

import { MenuItem, MenuList } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

import FixedLayout from "app/common/layouts/fixed-layout";
import GearDnd from "app/modules/gear-dnd/components/gear-dnd";
import reorder from "app/modules/gear-dnd/helpers/reorder";
import reorderNested from "app/modules/gear-dnd/helpers/reorder-nested";

import PackCategoryForm from "../../components/pack-category-form";
import packQuery from "../../queries/pack-query";
import movePackCategoryMutation from "../../mutations/move-pack-category-mutation";
import PacksSubheader from "../../components/packs-subheader";
import PackAddItemModal from "../../components/pack-add-item-modal";
import movePackGearMutation from "../../mutations/move-pack-gear-mutation";

const PackPage: BlitzPage = () => {
  const router = useRouter();

  const [addingCategory, setAddingCategory] = useState(false);
  const [editCategory, setEditCategory] = useState<string | null>(null);

  const [addItemToCategory, setAddItemToCategory] = useState<string | null>(
    null
  );

  const [movePackCategory] = useMutation(movePackCategoryMutation);
  const [movePackGear] = useMutation(movePackGearMutation);

  const [pack, { refetch }] = useQuery(packQuery, {
    id: router.query.id as string,
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
        packId: router.query.id as string,
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
        packId={router.query.id as string}
        categoryId={addItemToCategory}
        isOpen={!!addItemToCategory}
        onAdd={refetch}
        onClose={() => {
          setAddItemToCategory(null);
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
          </MenuList>
        )}
        itemMenu={() => (
          <MenuList>
            <MenuItem icon={<FaEdit />} onClick={console.log}>
              Edit item
            </MenuItem>
          </MenuList>
        )}
      />
    </>
  );
};

PackPage.authenticate = { redirectTo: Routes.LoginPage() };
PackPage.getLayout = (page) => {
  return <FixedLayout subheader={<PacksSubheader />}>{page}</FixedLayout>;
};

export default PackPage;
