import type { CategoryType } from "db";

import { faker } from "@faker-js/faker";

export type CategoryValues = {
  name?: string;
  type?: CategoryType;
  index?: number;
};

const getCategoryData = (values: CategoryValues) => ({
  name: faker.random.word(),
  type: "INVENTORY" as CategoryType,
  index: 0,
  ...values,
});

export default getCategoryData;
