import type { Pack } from "@prisma/client";
import type useCalculatePackTotals from "../hooks/use-calculate-pack-totals";

import { createContext } from "react";

type PackContext = {
  editPack: () => void;
  showDetails: () => void;

  pack: Pack;

  categories: ReturnType<typeof useCalculatePackTotals>["categories"];
  totalWeight: number;
  packWeight: number;
  baseWeight: number;
};

const packContext = createContext<PackContext>({} as PackContext);

export default packContext;
