import type { PackCategoryValues } from "test/data/get-pack-category-data";

import getPackCategoryData from "test/data/get-pack-category-data";

import db from "db";

type CreatePackCategoryValues = PackCategoryValues & { packId: string };

const createPackCategory = async (values: CreatePackCategoryValues) => {
  const data = getPackCategoryData(values);
  return db.packCategory.create({ data: { ...data, packId: values.packId } });
};

export default createPackCategory;
