import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const packCategoryQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const packCategory = await db.packCategory.findFirst({
      where: { id, pack: { userId: ctx.session.userId } },
    });

    if (!packCategory) throw new NotFoundError();

    return packCategory;
  }
);

export default packCategoryQuery;
