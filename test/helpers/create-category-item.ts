import type { CategoryItemValues } from "test/data/get-category-item-data";

import getCategoryItemData from "test/data/get-category-item-data";

import db from "db";

type CreateCategoryItemValues = CategoryItemValues & {
  categoryId: string;
  gearId: string;
};

const createCategoryItem = async (values: CreateCategoryItemValues) => {
  const data = getCategoryItemData(values);
  return db.categoryItem.create({
    data: { ...data, categoryId: values.categoryId, gearId: values.gearId },
  });
};

export default createCategoryItem;
