import type { TransactionFunction } from "app/types/transaction-function";

type Params = { categoryId: string };

const getNextPackItemIndex: TransactionFunction<Params, number> = async (
  transaction,
  ctx,
  { categoryId }
) => {
  return transaction.packCategoryItem.count({
    where: { categoryId },
  });
};

export default getNextPackItemIndex;
