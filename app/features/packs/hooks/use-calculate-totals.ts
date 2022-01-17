import type { PackResult } from "../queries/pack-query";

import { useMemo } from "react";

type Categories = Array<PackResult["categories"][number] & { weight: number }>;

const useCalculateTotals = (categories: Categories) => {
  return useMemo(() => {
    let total = 0;
    let packWeight = 0;
    let baseWeight = 0;

    categories.forEach((category) => {
      category.items.forEach((item) => {
        total += item.gear.weight;
        if (!item.worn) {
          packWeight += item.gear.weight;
          if (!item.gear.consumable) {
            baseWeight += item.gear.weight;
          }
        }
      });
    });

    return { total, packWeight, baseWeight };
  }, [categories]);
};

export default useCalculateTotals;
