import type { FC } from "react";
import type { DragAndDropState } from "app/components/drag-and-drop/contexts/gear-dnd-context";

import { useState, useContext } from "react";
import { useMutation } from "blitz";

import { HStack, Text } from "@chakra-ui/layout";
import { MenuItem, MenuList } from "@chakra-ui/menu";
import { Icon } from "@chakra-ui/icon";
import { IconButton } from "@chakra-ui/button";
import {
  FaClone,
  FaEdit,
  FaMinus,
  FaPlus,
  FaTrash,
  FaTshirt,
} from "react-icons/fa";

import gearOrganizerContext from "app/apps/inventory/contexts/gear-organizer-context";
import togglePackGearWornMutation from "app/apps/pack-gear/mutations/toggle-pack-gear-worn-mutation";
import updatePackGearQuantityMutation from "app/apps/pack-gear/mutations/update-pack-gear-quantity-mutation";

type PackOrganizerItemMenuProps = {
  item: DragAndDropState[number]["items"][number];
};

const PackOrganizerItemMenu: FC<PackOrganizerItemMenuProps> = ({ item }) => {
  const { refetch, editItem, deleteItem } = useContext(gearOrganizerContext);
  const [isIncrementing, setIsIncrementing] = useState(false);
  const [isDecrementing, setIsDecrementing] = useState(false);

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

        <HStack
          border="1px solid"
          borderColor="gray.100"
          rounded="full"
          p="2px"
        >
          <IconButton
            size="xs"
            rounded="full"
            icon={<FaMinus />}
            aria-label="decrement quantity"
            isDisabled={isLoading}
            isLoading={isDecrementing}
            onClick={async () => {
              setIsDecrementing(true);
              await updateQuantity({ id: item.id, type: "decrement" });
              await refetch();
              setIsDecrementing(false);
            }}
          />
          <Text fontSize="sm">{item.quantity}</Text>
          <IconButton
            size="xs"
            rounded="full"
            icon={<FaPlus />}
            aria-label="increment quantity"
            isDisabled={isLoading}
            isLoading={isIncrementing}
            onClick={async () => {
              setIsIncrementing(true);
              await updateQuantity({ id: item.id, type: "increment" });
              await refetch();
              setIsIncrementing(false);
            }}
          />
        </HStack>
      </HStack>
    </MenuList>
  );
};

export default PackOrganizerItemMenu;
