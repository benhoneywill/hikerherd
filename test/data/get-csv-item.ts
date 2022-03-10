import type { GearValues } from "./get-gear-data";

import faker from "@faker-js/faker";

import displayCurrency from "app/modules/common/helpers/display-currency";

import getGearData from "./get-gear-data";

type CsvRowValues = GearValues & {
  categoryName?: string;
  worn?: boolean;
  unit?: "gram" | "ounce";
  quantity?: number;
};

export type TestCsvItem = {
  name: string;
  category: string;
  weight: string;
  unit: string;
  notes: string;
  price: string;
  currency: string;
  link: string;
  image: string;
  consumable: string;
  worn: string;
  quantity: string;
};

const getCsvItem = (values: CsvRowValues = {}): TestCsvItem => {
  const gear = getGearData();

  return {
    name: gear.name,
    category: values.categoryName || faker.random.word(),
    weight: `${gear.weight}`,
    unit: values.unit || "gram",
    notes: gear.notes || "",
    price: gear.price ? `${gear.price / 100}` : "",
    currency: displayCurrency(gear.currency),
    link: gear.link || "",
    image: gear.imageUrl || "",
    consumable: gear.consumable ? "consumable" : "",
    worn: values.worn ? "worn" : "",
    quantity: `${values.quantity || 1}`,
  };
};

export default getCsvItem;
