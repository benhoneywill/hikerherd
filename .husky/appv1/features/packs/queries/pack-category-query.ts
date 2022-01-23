import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import getPackCategorySchema from "../schemas/get-pack-category-schema";

const packCategoryQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getPackCategorySchema),

  async ({ id }, ctx) => {
    const packCategory = await db.packCategory.findFirst({
      where: { id, pack: { userId: ctx.session.userId } },
    });

    if (!packCategory) throw new NotFoundError();

    return packCategory;
  }
);

export type PackCategoryResult = PromiseReturnType<typeof packCategoryQuery>;

export default packCategoryQuery;
