import type { TransactionFunction } from "app/types/transaction-function";

type Params = { categoryId: string; index: number };

const incrementPackItemIndexesFrom: TransactionFunction<Params> = async (
  transaction,
  ctx,
  { categoryId, index }
) => {
  await transaction.packCategoryItem.updateMany({
    where: {
      categoryId,
      index: { gte: index },
    },
    data: {
      index: { increment: 1 },
    },
  });
};

export default incrementPackItemIndexesFrom;
