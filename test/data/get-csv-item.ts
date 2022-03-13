import type { CurrencySign } from "app/helpers/sign-to-currency";

import faker from "@faker-js/faker";

import displayCurrency from "app/helpers/display-currency";

import getGearData from "./get-gear-data";

export type TestCsvItem = {
  name: string;
  category: string;
  weight: string;
  unit: string;
  notes: string;
  price: string;
  currency: CurrencySign | "";
  link: string;
  image: string;
  consumable: string;
  worn: string;
  quantity: string;
};

const getCsvItem = (values: Partial<TestCsvItem> = {}): TestCsvItem => {
  const gear = getGearData();

  return {
    name: gear.name,
    category: faker.random.word(),
    unit: "gram",
    notes: gear.notes,
    currency: displayCurrency(gear.currency),
    link: gear.link,
    image: gear.imageUrl,
    weight: `${gear.weight}`,
    price: `${gear.price / 100}`,
    consumable: gear.consumable ? "consumable" : "",
    worn: "",
    quantity: `${1}`,
    ...values,
  };
};

export default getCsvItem;
