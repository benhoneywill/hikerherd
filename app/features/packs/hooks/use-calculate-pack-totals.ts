import type { DragAndDropState } from "app/modules/drag-and-drop/contexts/gear-dnd-context";

import { useMemo } from "react";

const useCalculatePackTotals = (categories: DragAndDropState) => {
  return useMemo(() => {
    let totalWeight = 0;
    let packWeight = 0;
    let baseWeight = 0;

    const weightedCategories = categories.map((category) => {
      return {
        ...category,
        weight: category.items.reduce((acc, item) => {
          const itemWeight = item.gear.weight * (item.quantity || 1);

          totalWeight += itemWeight;
          if (!item.worn) {
            packWeight += itemWeight;
            if (!item.gear.consumable) {
              baseWeight += itemWeight;
            }
          }

          return acc + itemWeight;
        }, 0),
      };
    });

    return {
      categories: weightedCategories,
      totalWeight,
      packWeight,
      baseWeight,
    };
  }, [categories]);
};

export default useCalculatePackTotals;
