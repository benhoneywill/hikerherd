import type { FC } from "react";
import type { CategoryType } from "db";

import { useMutation } from "blitz";
import { useContext, Fragment } from "react";

import deleteCategoryMutation from "app/apps/categories/mutations/delete-category-mutation";
import deleteCategoryGearMutation from "app/apps/category-gear/mutations/delete-category-gear-mutation";
import ConfirmModal from "app/components/confirm-modal";
import CategoryForm from "app/apps/categories/components/category-form";
import UpdateCategoryGearForm from "app/apps/category-gear/components/update-category-gear-form";

import gearOrganizerContext from "../contexts/gear-organizer-context";

import ToggleItemTypeForm from "./toggle-item-type-form";
import AddItemToCategoryModal from "./add-item-to-category-modal";

type GearOrganizerModalsProps = {
  type: CategoryType;
};

const GearOrganizerModals: FC<GearOrganizerModalsProps> = ({ type }) => {
  const {
    refetch,

    addingCategory,
    editingCategory,
    deletingCategory,

    addingItemToCategory,
    deletingItem,
    editingItem,
    togglingMetaItem,

    closeModals,
  } = useContext(gearOrganizerContext);

  const [deleteCategory] = useMutation(deleteCategoryMutation);
  const [deleteGear] = useMutation(deleteCategoryGearMutation);

  return (
    <Fragment>
      <CategoryForm
        type={type}
        onSuccess={() => refetch()}
        isOpen={addingCategory || !!editingCategory}
        categoryId={editingCategory}
        onClose={closeModals}
      />

      <UpdateCategoryGearForm
        id={editingItem}
        onSuccess={() => refetch()}
        isOpen={!!editingItem}
        onClose={closeModals}
      />

      <AddItemToCategoryModal
        categoryId={addingItemToCategory}
        isOpen={!!addingItemToCategory}
        onClose={closeModals}
        onSuccess={() => refetch()}
      />

      <ConfirmModal
        isOpen={!!deletingCategory}
        onClose={closeModals}
        title="Delete this category"
        description="Are you sure you want to delete this category?"
        onConfirm={async () => {
          if (deletingCategory) {
            await deleteCategory({ id: deletingCategory });
            refetch();
          }
        }}
      />

      <ConfirmModal
        isOpen={!!deletingItem}
        onClose={closeModals}
        title="Delete this gear"
        description="Are you sure you want to delete this gear?"
        onConfirm={async () => {
          if (deletingItem) {
            await deleteGear({ id: deletingItem });
            refetch();
          }
        }}
      />

      <ToggleItemTypeForm
        type={type === "INVENTORY" ? "WISH_LIST" : "INVENTORY"}
        itemId={togglingMetaItem}
        onSuccess={() => refetch()}
        isOpen={!!togglingMetaItem}
        onClose={closeModals}
      />
    </Fragment>
  );
};

export default GearOrganizerModals;
