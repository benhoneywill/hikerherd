import type useCalculatePackTotals from "../hooks/use-calculate-pack-totals";

import { createContext } from "react";

type PackContext = {
  share?: boolean;

  editPack: () => void;
  showDetails: () => void;

  pack: {
    id: string;
    userId?: string;
    notes?: string | null;
    name?: string;
  };

  categories: ReturnType<typeof useCalculatePackTotals>["categories"];
  totalWeight: number;
  packWeight: number;
  baseWeight: number;

  refetchOrganizer: () => void;
};

const packContext = createContext<PackContext>({} as PackContext);

export default packContext;
