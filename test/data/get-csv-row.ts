import type { GearValues } from "./get-gear-data";

import faker from "@faker-js/faker";

import displayCurrency from "app/helpers/display-currency";

import getGearData from "./get-gear-data";

type CsvRowValues = GearValues & {
  categoryName?: string;
  worn?: boolean;
  unit?: "gram" | "ounce";
  quantity?: number;
};

const getCsvRow = (values: CsvRowValues = {}) => {
  const gear = getGearData();

  return [
    gear.name,
    values.categoryName || faker.random.word(),
    `${gear.weight}`,
    values.unit || "gram",
    gear.notes || "",
    gear.price ? `${gear.price / 100}` : "",
    displayCurrency(gear.currency),
    gear.link || "",
    gear.imageUrl || "",
    gear.consumable ? "consumable" : "",
    values.worn ? "worn" : "",
    `${values.quantity || 1}`,
  ];
};

export default getCsvRow;
