import type { FC } from "react";
import type { DragAndDropState } from "app/components/drag-and-drop/contexts/gear-dnd-context";

import { useContext } from "react";

import { MenuItem, MenuList } from "@chakra-ui/menu";
import { FaEdit, FaTrash } from "react-icons/fa";

import gearOrganizerContext from "app/apps/inventory/contexts/gear-organizer-context";

type PackOrganizerCategoryMenuProps = {
  category: DragAndDropState[number];
};

const PackOrganizerCategoryMenu: FC<PackOrganizerCategoryMenuProps> = ({
  category,
}) => {
  const { editCategory, deleteCategory } = useContext(gearOrganizerContext);

  return (
    <MenuList>
      <MenuItem icon={<FaEdit />} onClick={() => editCategory(category.id)}>
        Edit category
      </MenuItem>

      <MenuItem
        icon={<FaTrash />}
        onClick={() => deleteCategory(category.id)}
        isDisabled={category.items.length > 0}
      >
        Delete category
      </MenuItem>
    </MenuList>
  );
};

export default PackOrganizerCategoryMenu;
