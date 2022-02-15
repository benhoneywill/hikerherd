import type { Currency } from "db";

import { createContext } from "react";

export type DragAndDropItem = {
  id: string;
  worn?: boolean;
  quantity?: number;
  notes?: string | null;
  gear: {
    name: string;
    weight: number;
    price: number | null;
    currency: Currency;
    consumable: boolean;
    link: string | null;
    notes: string | null;
    imageUrl: string | null;
  };
};

type DragAndDropCategory = {
  id: string;
  name: string;
  items: DragAndDropItem[];
};

export type DragAndDropState = DragAndDropCategory[];

export type DragAndDropContext = {
  readonly?: boolean;
  state: DragAndDropState;

  addCategory?: () => void;
  addItemToCategory?: (categoryId: string) => void;
  editCategory?: (id: string) => void;

  categoryMenu?: (item: DragAndDropState[number]) => JSX.Element;
  itemMenu?: (item: DragAndDropState[number]["items"][number]) => JSX.Element;
  editItem?: (id: string) => void;
};

const dragAndDropContext = createContext<DragAndDropContext>(
  {} as DragAndDropContext
);

export default dragAndDropContext;
