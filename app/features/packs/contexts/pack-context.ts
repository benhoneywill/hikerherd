import type { Pack } from "@prisma/client";
import type useCalculatePackTotals from "../hooks/use-calculate-pack-totals";

import { createContext } from "react";

type UndefinedPack = {
  id: string;
  userId: undefined;
  name: undefined;
  notes: undefined;
};

type PackContext = {
  editPack: () => void;
  showDetails: () => void;

  pack: Pack | UndefinedPack;
  share?: boolean;

  categories: ReturnType<typeof useCalculatePackTotals>["categories"];
  totalWeight: number;
  packWeight: number;
  baseWeight: number;
};

const packContext = createContext<PackContext>({} as PackContext);

export default packContext;
