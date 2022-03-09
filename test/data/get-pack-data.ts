import { faker } from "@faker-js/faker";

export type PackValues = {
  name?: string;
};

const getPackData = (values: PackValues = {}) => ({
  name: faker.random.word(),
  ...values,
});

export default getPackData;
