import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/schemas/id-schema";

import db from "db";

import decrementPackCategoryIndexesAfter from "../functions/decrement-pack-category-indexes-after";

const deletePackCategoryMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async (prisma) => {
      const category = await prisma.packCategory.findUnique({
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

      const item = await prisma.packCategoryItem.findFirst({
        where: { categoryId: id },
      });

      if (item) {
        throw new Error("Can not delete a category while it still has items");
      }

      await decrementPackCategoryIndexesAfter(prisma, ctx, {
        packId: category.pack.id,
        index: category.index,
      });

      return prisma.packCategory.delete({
        where: { id },
      });
    });
  }
);

export default deletePackCategoryMutation;
