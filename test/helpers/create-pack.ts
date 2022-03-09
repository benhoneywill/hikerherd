import type { PackValues } from "test/data/get-pack-data";

import getPackData from "test/data/get-pack-data";
import slugify from "app/modules/common/helpers/slugify";

import db from "db";

type CreatePackValues = PackValues & { userId: string };

const createPack = async (values: CreatePackValues) => {
  const data = getPackData(values);
  const slug = slugify(data.name, { withRandomSuffix: true });

  return db.pack.create({
    data: {
      ...data,
      userId: values.userId,
      slug,
    },
  });
};

export default createPack;
