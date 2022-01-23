const GearOrganizerItemMenu = ({ item }) => {
  return (
    <MenuList>
      <MenuItem icon={<FaEdit />} onClick={() => setEditItem(item.id)}>
        Edit item
      </MenuItem>
      <MenuItem
        icon={<FaTrash />}
        onClick={() => setDeletingItem({ id: item.id, name: item.gear.name })}
      >
        Delete item
      </MenuItem>
      <MenuItem
        icon={<FaHamburger />}
        onClick={async () => {
          await toggleConsumable({ id: item.id });
          refetch();
        }}
      >
        {item.gear.consumable ? "Not consumable" : "Consumable"}
      </MenuItem>
      {type === "WISH_LIST" && (
        <MenuItem icon={<FaList />} onClick={() => setMovingItemBetween(item)}>
          Move to inventory
        </MenuItem>
      )}
      {type === "INVENTORY" && (
        <MenuItem icon={<FaStar />} onClick={() => setMovingItemBetween(item)}>
          Move to wish list
        </MenuItem>
      )}
    </MenuList>
  );
};

export default GearOrganizerItemMenu;
