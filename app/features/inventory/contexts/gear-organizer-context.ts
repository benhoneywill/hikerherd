import type { CategoryType } from "db";
import type { PromiseReturnType } from "blitz";
import type inventoryQuery from "../queries/inventory-query";

import { createContext } from "react";

type GearOrganizerState = PromiseReturnType<typeof inventoryQuery>;

type GearOrganizerContext = {
  type: CategoryType;
  state: GearOrganizerState;
  setState: (update: (state: GearOrganizerState) => GearOrganizerState) => void;
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

  togglingItemType: string | null;
  toggleItemType: (id: string) => void;
};

const gearOrganizerContext = createContext<GearOrganizerContext>(
  {} as GearOrganizerContext
);

export default gearOrganizerContext;
