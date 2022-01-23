const GearOrganizerCategoryMenu: FC = ({ category }) => {
  return (
    <MenuList>
      <MenuItem icon={<FaEdit />} onClick={() => setEditCategory(category.id)}>
        Edit category
      </MenuItem>
      <MenuItem
        icon={<FaTrash />}
        onClick={() => setDeletingCategory(category)}
        isDisabled={category.items.length > 0}
      >
        Delete category
      </MenuItem>
    </MenuList>
  );
};

export default GearOrganizerCategoryMenu;
