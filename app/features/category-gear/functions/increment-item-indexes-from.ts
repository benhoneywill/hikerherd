import type { DatabaseFunction } from "app/modules/common/types/database-function";

type Params = { categoryId: string; index: number };

const incrementItemIndexesFrom: DatabaseFunction<Params> = async (
  transaction,
  ctx,
  { categoryId, index }
) => {
  await transaction.categoryItem.updateMany({
    where: {
      categoryId,
      index: { gte: index },
    },
    data: {
      index: { increment: 1 },
    },
  });
};

export default incrementItemIndexesFrom;
