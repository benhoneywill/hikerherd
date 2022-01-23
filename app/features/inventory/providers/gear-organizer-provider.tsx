import type { CategoryType } from "@prisma/client";
import type { FC } from "react";

import { useQuery } from "blitz";
import { useEffect, useState } from "react";

import gearOrganizerContext from "../contexts/gear-organizer-context";
import inventoryQuery from "../queries/inventory-query";

const { Provider } = gearOrganizerContext;

type Id = string | null;

type GearOrganizerProviderProps = {
  type: CategoryType;
};

const GearOrganizerProvider: FC<GearOrganizerProviderProps> = ({
  type,
  children,
}) => {
  const [data, { refetch }] = useQuery(inventoryQuery, { type });
  const [state, setState] = useState(data);

  useEffect(() => {
    setState(data);
  }, [data]);

  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Id>(null);
  const [deletingCategory, setDeletingCategory] = useState<Id>(null);

  const [addingItemToCategory, setAddingItemToCategory] = useState<Id>(null);
  const [editingItem, setEditingItem] = useState<Id>(null);
  const [deletingItem, setDeletingItem] = useState<Id>(null);
  const [togglingItemType, setTogglingItemType] = useState<Id>(null);

  const closeModals = () => {
    setAddingCategory(false);
    setDeletingCategory(null);
    setEditingItem(null);
    setDeletingItem(null);
    setTogglingItemType(null);
    setAddingItemToCategory(null);
  };

  return (
    <Provider
      value={{
        type,
        state,
        setState,
        refetch,

        closeModals,

        addingCategory,
        addCategory: () => setAddingCategory(true),

        editingCategory,
        editCategory: (id: string) => setEditingCategory(id),

        deletingCategory,
        deleteCategory: (id: string) => setDeletingCategory(id),

        editingItem,
        editItem: (id: string) => setEditingItem(id),

        addingItemToCategory,
        addItemToCategory: (id: string) => setAddingItemToCategory(id),

        deletingItem,
        deleteItem: (id: string) => setDeletingItem(id),

        togglingItemType,
        toggleItemType: (id: string) => setTogglingItemType(id),
      }}
    >
      {children}
    </Provider>
  );
};

export default GearOrganizerProvider;
