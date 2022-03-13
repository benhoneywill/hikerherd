import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import moveCategorySchema from "../schemas/move-category-schema";
import decrementCategoryIndexesAfter from "../functions/decrement-category-indexes-after";
import incrementCategoryIndexesFrom from "../functions/increment-category-indexes-from";

const moveCategoryMutation = resolver.pipe(
  resolver.zod(moveCategorySchema),
  resolver.authorize(),

  async ({ id, index }, ctx) => {
    return db.$transaction(async (prisma) => {
      const category = await prisma.category.findUnique({
        where: { id },
        select: {
          type: true,
          index: true,
          userId: true,
        },
      });

      if (!category) {
        throw new NotFoundError();
      }

      if (category.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      await decrementCategoryIndexesAfter(prisma, ctx, {
        type: category.type,
        index: category.index,
      });

      await incrementCategoryIndexesFrom(prisma, ctx, {
        type: category.type,
        index,
      });

      return await prisma.category.update({
        where: { id },
        data: { index },
      });
    });
  }
);

export default moveCategoryMutation;
