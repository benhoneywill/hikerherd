import type { FC } from "react";
import type { DragAndDropState } from "app/modules/drag-and-drop/contexts/gear-dnd-context";

import { useContext } from "react";
import { useMutation } from "blitz";

import {
  IconButton,
  MenuItem,
  MenuList,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import {
  FaClone,
  FaEdit,
  FaMinus,
  FaPlus,
  FaTrash,
  FaTshirt,
} from "react-icons/fa";

import gearOrganizerContext from "app/features/inventory/contexts/gear-organizer-context";
import togglePackGearWornMutation from "app/features/pack-gear/mutations/toggle-pack-gear-worn-mutation";
import updatePackGearQuantityMutation from "app/features/pack-gear/mutations/update-pack-gear-quantity-mutation";

type PackOrganizerItemMenuProps = {
  item: DragAndDropState[number]["items"][number];
};

const PackOrganizerItemMenu: FC<PackOrganizerItemMenuProps> = ({ item }) => {
  const { refetch, editItem, deleteItem } = useContext(gearOrganizerContext);

  const [toggleWorn] = useMutation(togglePackGearWornMutation);
  const [updateQuantity] = useMutation(updatePackGearQuantityMutation);

  return (
    <MenuList>
      <MenuItem icon={<FaEdit />} onClick={() => editItem(item.id)}>
        Edit item
      </MenuItem>

      <MenuItem icon={<FaTrash />} onClick={() => deleteItem(item.id)}>
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

      <HStack py={1} px={3} justify="space-between">
        <HStack spacing={3}>
          <Icon w={3} h={3} as={FaClone} />
          <Text>Quantity</Text>
        </HStack>

        <HStack>
          <IconButton
            size="xs"
            icon={<FaMinus />}
            aria-label="decrement quantity"
            onClick={async () => {
              await updateQuantity({ id: item.id, type: "decrement" });
              refetch();
            }}
          />
          <span>{item.quantity}</span>
          <IconButton
            size="xs"
            icon={<FaPlus />}
            aria-label="increment quantity"
            onClick={async () => {
              await updateQuantity({ id: item.id, type: "increment" });
              refetch();
            }}
          />
        </HStack>
      </HStack>
    </MenuList>
  );
};

export default PackOrganizerItemMenu;
