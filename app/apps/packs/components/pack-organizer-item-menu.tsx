import type { FC } from "react";
import type { DragAndDropState } from "app/components/drag-and-drop/contexts/gear-dnd-context";

import { useContext } from "react";
import { useMutation } from "blitz";

import { MenuItem, MenuList } from "@chakra-ui/menu";
import { FaEdit, FaTrash, FaTshirt } from "react-icons/fa";

import gearOrganizerContext from "app/apps/inventory/contexts/gear-organizer-context";
import togglePackGearWornMutation from "app/apps/pack-gear/mutations/toggle-pack-gear-worn-mutation";
import updatePackGearQuantityMutation from "app/apps/pack-gear/mutations/update-pack-gear-quantity-mutation";
import QuantityPicker from "app/components/quantity-picker";

type PackOrganizerItemMenuProps = {
  item: DragAndDropState[number]["items"][number];
};

const PackOrganizerItemMenu: FC<PackOrganizerItemMenuProps> = ({ item }) => {
  const { refetch, editItem, deleteItem } = useContext(gearOrganizerContext);

  const [toggleWorn] = useMutation(togglePackGearWornMutation);
  const [updateQuantity, { isLoading }] = useMutation(
    updatePackGearQuantityMutation
  );

  return (
    <MenuList>
      <MenuItem icon={<FaEdit />} onClick={() => editItem(item.id)}>
        Edit item
      </MenuItem>

      <MenuItem icon={<FaTrash />} onClick={() => deleteItem(item.id)}>
        Remove item
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

      <QuantityPicker
        value={item.quantity}
        isLoading={isLoading}
        onDecrement={async () => {
          await updateQuantity({ id: item.id, type: "decrement" });
          await refetch();
        }}
        onIncrement={async () => {
          await updateQuantity({ id: item.id, type: "increment" });
          await refetch();
        }}
      />
    </MenuList>
  );
};

export default PackOrganizerItemMenu;
