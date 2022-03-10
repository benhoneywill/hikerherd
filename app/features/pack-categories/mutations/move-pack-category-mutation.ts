import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import decrementPackCategoryIndexesAfter from "../functions/decrement-pack-category-indexes-after";
import incrementPackCategoryIndexesFrom from "../functions/increment-pack-category-indexes-from";
import movePackCategorySchema from "../schemas/move-pack-category-schema";

const movePackCategoryMutation = resolver.pipe(
  resolver.zod(movePackCategorySchema),
  resolver.authorize(),

  async ({ id, index }, ctx) => {
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

      await decrementPackCategoryIndexesAfter(prisma, ctx, {
        packId: category.pack.id,
        index: category.index,
      });

      await incrementPackCategoryIndexesFrom(prisma, ctx, {
        packId: category.pack.id,
        index,
      });

      return await prisma.packCategory.update({
        where: { id },
        data: { index },
      });
    });
  }
);

export default movePackCategoryMutation;
