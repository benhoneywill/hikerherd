import type { TransactionFunction } from "app/types/transaction-function";

type Params = { packId: string };

const getNextPackCategoryIndex: TransactionFunction<Params, number> = async (
  transaction,
  ctx,
  { packId }
) => {
  const lastCategory = await transaction.packCategory.findFirst({
    where: { packId },
    orderBy: { index: "desc" },
  });

  if (lastCategory) {
    return lastCategory.index + 1;
  } else {
    return 0;
  }
};

export default getNextPackCategoryIndex;
