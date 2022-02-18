import type { DragAndDropState } from "app/modules/drag-and-drop/contexts/gear-dnd-context";

import { useMemo } from "react";

const useCalculatePackTotals = (categories: DragAndDropState) => {
  return useMemo(() => {
    let totalWeight = 0;
    let wornWeight = 0;
    let consumableWeight = 0;

    const weightedCategories = categories.map((category) => {
      return {
        ...category,
        weight: category.items.reduce((acc, item) => {
          const itemWeight = item.gear.weight * (item.quantity || 1);

          totalWeight += itemWeight;
          if (item.worn) {
            wornWeight += itemWeight;
          }
          if (item.gear.consumable) {
            consumableWeight += itemWeight;
          }

          return acc + itemWeight;
        }, 0),
      };
    });

    return {
      categories: weightedCategories,
      totalWeight,
      packWeight: totalWeight - wornWeight,
      baseWeight: totalWeight - wornWeight - consumableWeight,
      wornWeight,
      consumableWeight,
    };
  }, [categories]);
};

export default useCalculatePackTotals;
