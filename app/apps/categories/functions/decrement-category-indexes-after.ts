import type { CategoryType } from "db";
import type { TransactionFunction } from "app/types/transaction-function";

type Params = {
  type: CategoryType;
  index: number;
};

const decrementCategoryIndexesAfter: TransactionFunction<Params> = async (
  transaction,
  ctx,
  { type, index }
) => {
  await transaction.category.updateMany({
    where: {
      userId: ctx.session.userId,
      type,
      index: { gt: index },
    },
    data: {
      index: {
        decrement: 1,
      },
    },
  });
};

export default decrementCategoryIndexesAfter;
