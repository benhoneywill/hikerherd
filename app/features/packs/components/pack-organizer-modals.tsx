import type { FC } from "react";

import { useContext, Fragment } from "react";
import { useMutation } from "blitz";

import gearOrganizerContext from "app/features/inventory/contexts/gear-organizer-context";
import deletePackCategoryMutation from "app/features/pack-categories/mutations/delete-pack-category-mutation";
import deletePackGearMutation from "app/features/pack-gear/mutations/delete-pack-gear-mutation";
import PackCategoryForm from "app/features/pack-categories/components/pack-category-form";
import ConfirmModal from "app/modules/common/components/confirm-modal";
import UpdatePackGearForm from "app/features/pack-gear/components/update-pack-gear-form";

import PackAddItemModal from "./pack-add-item-modal";

type PackOrganizerModalsProps = {
  id: string;
};

const PackOrganizerModals: FC<PackOrganizerModalsProps> = ({ id }) => {
  const {
    refetch,

    addingCategory,
    editingCategory,
    deletingCategory,

    addingItemToCategory,
    deletingItem,
    editingItem,

    closeModals,
  } = useContext(gearOrganizerContext);

  const [deleteCategory] = useMutation(deletePackCategoryMutation);
  const [deleteGear] = useMutation(deletePackGearMutation);

  return (
    <Fragment>
      <PackCategoryForm
        packId={id}
        onSuccess={() => refetch()}
        isOpen={addingCategory || !!editingCategory}
        categoryId={editingCategory}
        onClose={closeModals}
      />

      <PackAddItemModal
        packId={id}
        categoryId={addingItemToCategory}
        isOpen={!!addingItemToCategory}
        onSuccess={refetch}
        onClose={closeModals}
      />

      <UpdatePackGearForm
        id={editingItem}
        onSuccess={() => refetch()}
        isOpen={!!editingItem}
        onClose={closeModals}
      />

      <ConfirmModal
        isOpen={!!deletingCategory}
        onClose={closeModals}
        title="Delete category"
        description="Are you sure?"
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
        title="Delete gear"
        description="Are you sure?"
        onConfirm={async () => {
          if (deletingItem) {
            await deleteGear({ id: deletingItem });
            refetch();
          }
        }}
      />
    </Fragment>
  );
};

export default PackOrganizerModals;
