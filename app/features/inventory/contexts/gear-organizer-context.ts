import type { DragAndDropState } from "app/modules/drag-and-drop/contexts/gear-dnd-context";

import { createContext } from "react";

type GearOrganizerContext = {
  state: DragAndDropState;
  setState: (update: (state: DragAndDropState) => DragAndDropState) => void;
  refetch: () => void;

  closeModals: () => void;

  addingCategory: boolean;
  addCategory: () => void;

  editingCategory: string | null;
  editCategory: (id: string) => void;

  deletingCategory: string | null;
  deleteCategory: (id: string) => void;

  addingItemToCategory: string | null;
  addItemToCategory: (id: string) => void;

  editingItem: string | null;
  editItem: (id: string) => void;

  deletingItem: string | null;
  deleteItem: (id: string) => void;

  togglingMetaItem: string | null;
  toggleMetaItem: (id: string) => void;
};

const gearOrganizerContext = createContext<GearOrganizerContext>(
  {} as GearOrganizerContext
);

export default gearOrganizerContext;
