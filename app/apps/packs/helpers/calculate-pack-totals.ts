import type { DragAndDropState } from "app/components/drag-and-drop/contexts/gear-dnd-context";

const calculatePackTotals = (categories: DragAndDropState) => {
  let totalWeight = 0;
  let wornWeight = 0;
  let consumableWeight = 0;
  let baseWeight = 0;

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

        if (!item.worn && !item.gear.consumable) {
          baseWeight += itemWeight;
        }

        return acc + itemWeight;
      }, 0),
    };
  });

  return {
    categories: weightedCategories,
    totalWeight,
    packWeight: totalWeight - wornWeight,
    baseWeight,
    wornWeight,
    consumableWeight,
  };
};

export default calculatePackTotals;
