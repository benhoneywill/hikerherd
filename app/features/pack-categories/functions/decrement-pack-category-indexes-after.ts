import type { DatabaseFunction } from "app/modules/common/types/database-function";

type Params = {
  packId: string;
  index: number;
};

const decrementPackCategoryIndexesAfter: DatabaseFunction<Params> = async (
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
