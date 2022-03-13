import type { TransactionFunction } from "app/types/transaction-function";

type Params = {
  categoryId: string;
  index: number;
};

const decrementItemIndexesAfter: TransactionFunction<Params> = async (
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
