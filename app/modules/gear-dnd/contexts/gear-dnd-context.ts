import type {
  Gear,
  Category,
  CategoryItem,
  PackCategory,
  PackCategoryItem,
} from "db";

import { createContext } from "react";

type GearDndCategory<C, I> = C & {
  items: Array<I & { gear: Gear; worn?: boolean; quantity?: number }>;
};

export type GearDndState = Array<
  | GearDndCategory<Category, CategoryItem>
  | GearDndCategory<PackCategory, PackCategoryItem>
>;

export type GearDndContext = {
  vertical: boolean;
  readonly?: boolean;
  state: GearDndState;

  addCategory?: () => void;
  categoryMenu?: (item: GearDndState[number]) => JSX.Element;

  addItemToCategory?: (categoryId: string) => void;
  itemMenu?: (item: GearDndState[number]["items"][number]) => JSX.Element;
};

const gearDndContext = createContext<GearDndContext>({} as GearDndContext);

export default gearDndContext;
