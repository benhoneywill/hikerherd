import type { FC } from "react";

import { useMutation } from "blitz";

import { FcPlus, FcList, FcRating, FcSearch } from "react-icons/fc";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";

import AddPackGearForm from "app/features/pack-gear/components/add-pack-gear-form";
import TabModal from "app/modules/common/components/tab-modal";
import GlobalGearSearch from "app/features/discover/components/global-gear-search";

import addGearToPackMutation from "../mutations/add-gear-to-pack-mutation";

import PackAddInventoryItem from "./pack-add-inventory-item";

type PackAddItemModalProps = {
  categoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const PackAddItemModal: FC<PackAddItemModalProps> = ({
  categoryId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [addGearToPack] = useMutation(addGearToPackMutation);
  const toast = useToast();

  const handleSuccess = () => {
    onSuccess();
    toast({
      title: "Success",
      description: "The item has been added to your pack.",
      status: "success",
    });
    onClose();
  };

  const addToPack = async (gearId: string) => {
    if (categoryId) {
      await addGearToPack({ gearId, categoryId });
      handleSuccess();
    }
  };

  return (
    <TabModal
      isOpen={isOpen}
      onClose={onClose}
      tabs={[
        {
          title: "Inventory",
          icon: FcList,
          content: (
            <PackAddInventoryItem type="INVENTORY" addToPack={addToPack} />
          ),
        },
        {
          title: "Wish List",
          icon: FcRating,
          content: (
            <PackAddInventoryItem type="WISH_LIST" addToPack={addToPack} />
          ),
        },
        {
          title: "New",
          icon: FcPlus,
          content: (
            <AddPackGearForm
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
                  onClick={async () => {
                    if (categoryId) {
                      await addToPack(gear.id);
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

export default PackAddItemModal;
