import type { PackCategoryItemValues } from "test/data/get-pack-category-item-data";

import getPackCategoryItemData from "test/data/get-pack-category-item-data";

import db from "db";

type CreatePackCategoryItemValues = PackCategoryItemValues & {
  categoryId: string;
  gearId: string;
};

const createPackCategoryItem = async (values: CreatePackCategoryItemValues) => {
  const data = getPackCategoryItemData(values);

  return db.packCategoryItem.create({
    data: {
      ...data,
      categoryId: values.categoryId,
      gearId: values.gearId,
    },
  });
};

export default createPackCategoryItem;
