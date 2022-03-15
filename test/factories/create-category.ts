import type { CategoryValues } from "test/data/get-category-data";

import getCategoryData from "test/data/get-category-data";

import db from "db";

type CreateCategoryValues = CategoryValues & { userId: string };

const createCategory = async (values: CreateCategoryValues) => {
  const data = getCategoryData(values);
  return db.category.create({ data: { ...data, userId: values.userId } });
};

export default createCategory;
