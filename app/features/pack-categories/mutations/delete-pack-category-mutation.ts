import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const deletePackCategoryMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async () => {
      const category = await db.packCategory.findUnique({
        where: { id },
        select: {
          index: true,
          pack: {
            select: { id: true, userId: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundError();
      }

      if (category.pack.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      const item = await db.packCategoryItem.findFirst({
        where: { categoryId: id },
      });

      if (item) {
        throw new Error("Can not delete a category while it still has items");
      }

      // Decrement the indexes of all the categories with
      // a higher index than this category
      await db.packCategory.updateMany({
        where: {
          packId: category.pack.id,
          index: { gt: category.index },
        },
        data: {
          index: {
            decrement: 1,
          },
        },
      });

      return db.packCategory.delete({
        where: { id },
      });
    });
  }
);

export default deletePackCategoryMutation;
