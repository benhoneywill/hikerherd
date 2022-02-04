import type { FC } from "react";
import type { DragAndDropItem } from "app/modules/drag-and-drop/contexts/gear-dnd-context";

import { useContext } from "react";

import { MenuItem, MenuList } from "@chakra-ui/menu";
import { FaEdit, FaTrash } from "react-icons/fa";

import gearOrganizerContext from "../contexts/gear-organizer-context";

type GearOrganizerCategoryMenuProps = {
  category: { id: string; items: DragAndDropItem[] };
};

const GearOrganizerCategoryMenu: FC<GearOrganizerCategoryMenuProps> = ({
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

export default GearOrganizerCategoryMenu;
