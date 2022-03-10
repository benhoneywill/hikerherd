import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

import decrementCategoryIndexesAfter from "../functions/decrement-category-indexes-after";

const deleteCategoryMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async (prisma) => {
      const category = await prisma.category.findUnique({
        where: { id },
        select: {
          type: true,
          index: true,
          userId: true,
          items: { take: 1 },
        },
      });

      if (!category) {
        throw new NotFoundError();
      }

      if (category.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      if (category.items.length > 0) {
        throw new Error("Can not delete a category that still has items");
      }

      await decrementCategoryIndexesAfter(prisma, ctx, {
        type: category.type,
        index: category.index,
      });

      return prisma.category.delete({
        where: { id },
      });
    });
  }
);

export default deleteCategoryMutation;
