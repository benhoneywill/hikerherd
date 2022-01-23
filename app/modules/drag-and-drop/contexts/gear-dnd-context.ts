import type {
  Gear,
  Category,
  CategoryItem,
  PackCategory,
  PackCategoryItem,
} from "db";

import { createContext } from "react";

export type DragAndDropState = Array<
  (Category | PackCategory) & {
    items: Array<
      (CategoryItem | PackCategoryItem) & {
        gear: Gear;
        worn?: boolean;
        notes?: string;
        quantity?: number;
      }
    >;
  }
>;

export type DragAndDropContext = {
  readonly?: boolean;
  state: DragAndDropState;

  addCategory?: () => void;
  addItemToCategory?: (categoryId: string) => void;

  categoryMenu?: (item: DragAndDropState[number]) => JSX.Element;
  itemMenu?: (item: DragAndDropState[number]["items"][number]) => JSX.Element;
};

const dragAndDropContext = createContext<DragAndDropContext>(
  {} as DragAndDropContext
);

export default dragAndDropContext;
