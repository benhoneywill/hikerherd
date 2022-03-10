import type { CategoryType } from "db";
import type { DatabaseFunction } from "app/modules/common/types/database-function";

type Params = { type: CategoryType };

const getNextCategoryIndex: DatabaseFunction<Params, number> = async (
  transaction,
  ctx,
  { type }
) => {
  const user = await transaction.user.findUnique({
    where: { id: ctx.session.userId },
    select: {
      categories: {
        where: { type },
        orderBy: { index: "desc" },
        take: 1,
        select: { index: true },
      },
    },
  });

  if (!user) {
    throw new Error("No user found matching that session ID");
  }

  const lastCategory = user.categories[0];

  if (lastCategory) {
    return lastCategory.index + 1;
  } else {
    return 0;
  }
};

export default getNextCategoryIndex;
