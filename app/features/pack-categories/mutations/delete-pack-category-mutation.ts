import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const deletePackCategoryMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async () => {
      const category = await db.packCategory.findFirst({
        where: { id, pack: { userId: ctx.session.userId } },
      });

      if (!category) {
        throw new NotFoundError();
      }

      const item = await db.packCategoryItem.findFirst({
        where: {
          categoryId: id,
        },
      });

      if (item) {
        throw new Error("Category still has items");
      }

      return db.packCategory.delete({
        where: {
          id,
        },
      });
    });
  }
);

export default deletePackCategoryMutation;
