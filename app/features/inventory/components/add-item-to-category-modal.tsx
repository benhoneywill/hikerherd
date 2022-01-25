import type { FC } from "react";
import type { CategoryType } from "@prisma/client";

import { useState } from "react";
import { useMutation } from "blitz";

import { FcPlus, FcSearch } from "react-icons/fc";
import { Button, useToast } from "@chakra-ui/react";

import TabModal from "app/modules/common/components/tab-modal";
import AddCategoryGearForm from "app/features/category-gear/components/add-category-gear-form";
import GlobalGearSearch from "app/features/discover/components/global-gear-search";
import addToInventoryMutation from "app/features/discover/mutations/add-to-inventory-mutation";

type AddItemToCategoryModalProps = {
  categoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  type: CategoryType;
  onSuccess: () => void;
};

const AddItemToCategoryModal: FC<AddItemToCategoryModalProps> = ({
  categoryId,
  isOpen,
  onClose,
  type,
  onSuccess,
}) => {
  const toast = useToast();
  const [addToInventory] = useMutation(addToInventoryMutation);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  const handleSuccess = () => {
    setIsAdding(null);
    onSuccess();
    toast({
      title: "Success",
      description: "The item has been added.",
      status: "success",
    });
    onClose();
  };

  return (
    <TabModal
      isOpen={isOpen}
      onClose={onClose}
      tabs={[
        {
          title: "New",
          icon: FcPlus,
          content: (
            <AddCategoryGearForm
              categoryId={categoryId}
              onClose={onClose}
              onSuccess={handleSuccess}
            />
          ),
        },
        {
          title: "Search",
          icon: FcSearch,
          content: (
            <GlobalGearSearch
              gearActions={(gear) => (
                <Button
                  isFullWidth
                  isLoading={isAdding === gear.id}
                  size="sm"
                  colorScheme="green"
                  onClick={async () => {
                    if (categoryId) {
                      setIsAdding(gear.id);
                      await addToInventory({
                        type,
                        gearId: gear.id,
                        categoryId,
                      });
                      handleSuccess();
                    }
                  }}
                >
                  Add
                </Button>
              )}
            />
          ),
        },
      ]}
    />
  );
};

export default AddItemToCategoryModal;