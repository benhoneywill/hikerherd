import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import updatePackCategorySchema from "../schemas/update-pack-category-schema";

const updatePackCategoryMutation = resolver.pipe(
  resolver.zod(updatePackCategorySchema),
  resolver.authorize(),

  async ({ id, name }, ctx) => {
    const packCategory = await db.packCategory.findFirst({
      where: { id, pack: { userId: ctx.session.userId } },
    });

    if (!packCategory) {
      throw new NotFoundError();
    }

    return await db.packCategory.update({
      where: { id },
      data: {
        name,
      },
    });
  }
);

export type UpdatePackCategoryResult = PromiseReturnType<
  typeof updatePackCategoryMutation
>;

export default updatePackCategoryMutation;
