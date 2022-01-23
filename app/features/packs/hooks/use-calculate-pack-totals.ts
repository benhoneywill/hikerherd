import type { PromiseReturnType } from "blitz";
import type packOrganizerQuery from "../queries/pack-organizer-query";

import { useMemo } from "react";

type PackOrganizerResult = PromiseReturnType<typeof packOrganizerQuery>;

const useCalculatePackTotals = (
  categories: PackOrganizerResult["categories"]
) => {
  return useMemo(() => {
    let totalWeight = 0;
    let packWeight = 0;
    let baseWeight = 0;

    const weightedCategories = categories.map((category) => {
      return {
        ...category,
        weight: category.items.reduce((acc, item) => {
          const itemWeight = item.gear.weight * item.quantity;

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
