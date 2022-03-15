import type useCalculatePackTotals from "../hooks/use-calculate-pack-totals";

import { createContext } from "react";

type PackContext = {
  share?: boolean;

  editPack: () => void;
  showDetails: () => void;

  pack: {
    id: string;
    notes?: string | null;
    name?: string;
    private?: boolean;
  };

  user?: {
    id: string;
    avatar_id: string | null;
    avatar_version: number | null;
    username: string;
  };

  categories: ReturnType<typeof useCalculatePackTotals>["categories"];
  totalWeight: number;
  packWeight: number;
  baseWeight: number;

  refetchOrganizer: () => void;
};

const packContext = createContext<PackContext>({} as PackContext);

export default packContext;
