import type { DatabaseFunction } from "app/modules/common/types/database-function";

type Params = { categoryId: string };

const getNextItemIndex: DatabaseFunction<Params, number> = async (
  transaction,
  ctx,
  { categoryId }
) => {
  return transaction.categoryItem.count({
    where: { categoryId },
  });
};

export default getNextItemIndex;
