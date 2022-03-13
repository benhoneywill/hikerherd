import type { TransactionFunction } from "app/types/transaction-function";

type Params = {
  packId: string;
  index: number;
};

const decrementPackCategoryIndexesAfter: TransactionFunction<Params> = async (
  transaction,
  ctx,
  { packId, index }
) => {
  await transaction.packCategory.updateMany({
    where: {
      packId,
      index: { gt: index },
    },
    data: {
      index: {
        decrement: 1,
      },
    },
  });
};

export default decrementPackCategoryIndexesAfter;
