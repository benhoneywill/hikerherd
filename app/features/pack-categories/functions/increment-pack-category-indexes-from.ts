import type { DatabaseFunction } from "app/modules/common/types/database-function";

type Params = { packId: string; index: number };

const incrementPackCategoryIndexesFrom: DatabaseFunction<Params> = async (
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
