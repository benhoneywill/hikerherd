import type { FC } from "react";
import type { DragAndDropState } from "app/modules/drag-and-drop/contexts/gear-dnd-context";

import { useState } from "react";

import gearOrganizerContext from "../contexts/gear-organizer-context";

const { Provider } = gearOrganizerContext;

type Id = string | null;

type GearOrganizerProviderProps = {
  state: DragAndDropState;
  setState: (update: (state: DragAndDropState) => DragAndDropState) => void;
  refetch: () => void;
};

const GearOrganizerProvider: FC<GearOrganizerProviderProps> = ({
  state,
  setState,
  refetch,
  children,
}) => {
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Id>(null);
  const [deletingCategory, setDeletingCategory] = useState<Id>(null);

  const [addingItemToCategory, setAddingItemToCategory] = useState<Id>(null);
  const [editingItem, setEditingItem] = useState<Id>(null);
  const [deletingItem, setDeletingItem] = useState<Id>(null);

  const [togglingMetaItem, setTogglingMetaItem] = useState<Id>(null);

  const closeModals = () => {
    setAddingCategory(false);
    setDeletingCategory(null);
    setEditingItem(null);
    setDeletingItem(null);
    setTogglingMetaItem(null);
    setAddingItemToCategory(null);
  };

  return (
    <Provider
      value={{
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

        togglingMetaItem,
        toggleMetaItem: (id: string) => setTogglingMetaItem(id),
      }}
    >
      {children}
    </Provider>
  );
};

export default GearOrganizerProvider;
