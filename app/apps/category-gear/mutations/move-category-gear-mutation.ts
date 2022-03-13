import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import decrementItemIndexesAfter from "../functions/decrement-item-indexes-after";
import incrementItemIndexesFrom from "../functions/increment-item-indexes-from";
import moveCategoryGearSchema from "../schemas/move-category-gear-schema";

const moveCategoryGearMutation = resolver.pipe(
  resolver.zod(moveCategoryGearSchema),
  resolver.authorize(),

  async ({ id, categoryId, index }, ctx) => {
    return db.$transaction(async (prisma) => {
      const categoryItem = await prisma.categoryItem.findUnique({
        where: { id },
        select: {
          index: true,
          category: {
            select: {
              id: true,
              userId: true,
              type: true,
            },
          },
        },
      });

      if (!categoryItem) {
        throw new NotFoundError();
      }

      if (categoryItem.category.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true, userId: true },
      });

      if (!category) {
        throw new NotFoundError();
      }

      if (category.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      await decrementItemIndexesAfter(prisma, ctx, {
        categoryId: categoryItem.category.id,
        index: categoryItem.index,
      });

      await incrementItemIndexesFrom(prisma, ctx, {
        categoryId,
        index,
      });

      return await prisma.categoryItem.update({
        where: { id },
        data: {
          categoryId,
          index,
        },
      });
    });
  }
);

export default moveCategoryGearMutation;
