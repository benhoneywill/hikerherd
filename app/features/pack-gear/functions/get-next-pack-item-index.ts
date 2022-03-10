import type { DatabaseFunction } from "app/modules/common/types/database-function";

type Params = { categoryId: string };

const getNextPackItemIndex: DatabaseFunction<Params, number> = async (
  transaction,
  ctx,
  { categoryId }
) => {
  return transaction.packCategoryItem.count({
    where: { categoryId },
  });
};

export default getNextPackItemIndex;
