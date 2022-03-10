import type { DatabaseFunction } from "app/modules/common/types/database-function";

type Params = {
  categoryId: string;
  index: number;
};

const decrementItemIndexesAfter: DatabaseFunction<Params> = async (
  transaction,
  ctx,
  { categoryId, index }
) => {
  await transaction.categoryItem.updateMany({
    where: {
      categoryId: categoryId,
      index: { gt: index },
    },
    data: {
      index: { decrement: 1 },
    },
  });
};

export default decrementItemIndexesAfter;
