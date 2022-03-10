import type { DatabaseFunction } from "app/modules/common/types/database-function";
import type { CategoryType, Category } from "@prisma/client";

import getNextCategoryIndex from "./get-next-category-index";

type Params = {
  categoryName: string;
  type?: CategoryType;
};

const findOrCreateCategoryByName: DatabaseFunction<Params, Category> = async (
  transaction,
  ctx,
  { categoryName, type = "INVENTORY" }
) => {
  const existingCategory = await transaction.category.findFirst({
    where: {
      userId: ctx.session.userId,
      type,
      name: { equals: categoryName, mode: "insensitive" },
    },
  });

  if (existingCategory) return existingCategory;

  const index = await getNextCategoryIndex(transaction, ctx, { type });

  return transaction.category.create({
    data: {
      userId: ctx.session.userId,
      type,
      name: categoryName,
      index,
    },
  });
};

export default findOrCreateCategoryByName;
