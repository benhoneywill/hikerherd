import type { TransactionFunction } from "app/types/transaction-function";

type Params = { packId: string; index: number };

const incrementPackCategoryIndexesFrom: TransactionFunction<Params> = async (
  transaction,
  ctx,
  { packId, index }
) => {
  await transaction.packCategory.updateMany({
    where: {
      packId: packId,
      index: { gte: index },
    },
    data: {
      index: {
        increment: 1,
      },
    },
  });
};

export default incrementPackCategoryIndexesFrom;
