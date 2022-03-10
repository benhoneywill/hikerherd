import type { DatabaseFunction } from "app/modules/common/types/database-function";

type Params = { packId: string };

const getNextPackCategoryIndex: DatabaseFunction<Params, number> = async (
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
