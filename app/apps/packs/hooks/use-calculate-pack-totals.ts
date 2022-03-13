import type { DragAndDropState } from "app/components/drag-and-drop/contexts/gear-dnd-context";

import { useMemo } from "react";

import calculatePackTotals from "../helpers/calculate-pack-totals";

const useCalculatePackTotals = (categories: DragAndDropState) => {
  return useMemo(() => {
    return calculatePackTotals(categories);
  }, [categories]);
};

export default useCalculatePackTotals;
