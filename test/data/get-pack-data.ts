import { faker } from "@faker-js/faker";

export type PackValues = {
  name?: string;
  private?: boolean;
};

const getPackData = (values: PackValues = {}) => ({
  name: faker.random.word(),
  private: false,
  ...values,
});

export default getPackData;
