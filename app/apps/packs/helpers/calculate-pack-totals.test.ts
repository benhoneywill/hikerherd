import type { DragAndDropState } from "app/components/drag-and-drop/contexts/gear-dnd-context";

import faker from "@faker-js/faker";

import getGearData from "test/data/get-gear-data";
import getPackCategoryItemData from "test/data/get-pack-category-item-data";

import calculatePackTotals from "./calculate-pack-totals";

const categories: DragAndDropState = [
  {
    id: faker.datatype.uuid(),
    name: faker.random.word(),
    items: [
      {
        id: faker.datatype.uuid(),
        ...getPackCategoryItemData({ worn: true, quantity: 2 }),
        gear: {
          ...getGearData({ weight: 100 }),
        },
      },
      {
        id: faker.datatype.uuid(),
        ...getPackCategoryItemData({ worn: false, quantity: 1 }),
        gear: {
          ...getGearData({ weight: 20, consumable: true }),
        },
      },
    ],
  },
  {
    id: faker.datatype.uuid(),
    name: faker.random.word(),
    items: [
      {
        id: faker.datatype.uuid(),
        ...getPackCategoryItemData({ worn: false, quantity: 3 }),
        gear: {
          ...getGearData({ weight: 5, consumable: false }),
        },
      },
    ],
  },
];

describe("calculatePackTotals", () => {
  it("returns the correct totals", () => {
    const totals = calculatePackTotals(categories);

    expect(totals.totalWeight).toEqual(235);
    expect(totals.packWeight).toEqual(35);
    expect(totals.baseWeight).toEqual(15);
  });
});
