import faker from "@faker-js/faker";

export type PackCategoryItemValues = {
  index?: number;
  worn?: boolean;
  quantity?: number;
};

const getPackCategoryItemData = (values: PackCategoryItemValues) => ({
  index: 0,
  worn: faker.datatype.boolean(),
  quantity: faker.datatype.number({ min: 1, max: 9 }),
  ...values,
});

export default getPackCategoryItemData;
