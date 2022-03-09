import { faker } from "@faker-js/faker";

export type PackCategoryValues = {
  name?: string;
  index?: number;
};

const getPackCategoryData = (values: PackCategoryValues) => ({
  name: faker.random.word(),
  index: 0,
  ...values,
});

export default getPackCategoryData;
