import type { TransactionFunction } from "app/types/transaction-function";

type Params = { categoryId: string };

const getNextItemIndex: TransactionFunction<Params, number> = async (
  transaction,
  ctx,
  { categoryId }
) => {
  return transaction.categoryItem.count({
    where: { categoryId },
  });
};

export default getNextItemIndex;
