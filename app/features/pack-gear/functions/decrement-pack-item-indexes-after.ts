import type { DatabaseFunction } from "app/modules/common/types/database-function";

type Params = {
  categoryId: string;
  index: number;
};

const decrementPackItemIndexesAfter: DatabaseFunction<Params> = async (
  transaction,
  ctx,
  { categoryId, index }
) => {
  await transaction.packCategoryItem.updateMany({
    where: {
      categoryId: categoryId,
      index: { gt: index },
    },
    data: {
      index: { decrement: 1 },
    },
  });
};

export default decrementPackItemIndexesAfter;
