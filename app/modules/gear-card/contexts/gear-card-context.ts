import type { Currency } from "db";

import { createContext } from "react";

export type GearCardContext = {
  name: string;
  weight: number;
  imageUrl?: string | null;
  price?: number | null;
  currency?: Currency;
  worn?: boolean;
  consumable?: boolean;
  link?: string | null;
  notes?: string | null;
  quantity?: number;
};

const gearCardContext = createContext<GearCardContext>({} as GearCardContext);

export default gearCardContext;
