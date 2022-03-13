import type { CategoryType } from "db";
import type { TransactionFunction } from "app/types/transaction-function";

type Params = { type: CategoryType; index: number };

const incrementCategoryIndexesFrom: TransactionFunction<Params> = async (
  transaction,
  ctx,
  { type, index }
) => {
  await transaction.category.updateMany({
    where: {
      userId: ctx.session.userId,
      type: type,
      index: { gte: index },
    },
    data: {
      index: {
        increment: 1,
      },
    },
  });
};

export default incrementCategoryIndexesFrom;
