import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import decrementPackItemIndexesAfter from "../functions/decrement-pack-item-indexes-after";
import incrementPackItemIndexesFrom from "../functions/increment-pack-item-indexes-from";
import movePackGearSchema from "../schemas/move-pack-gear-schema";

const movePackGearMutation = resolver.pipe(
  resolver.zod(movePackGearSchema),
  resolver.authorize(),

  async ({ id, categoryId, index }, ctx) => {
    return db.$transaction(async (prisma) => {
      const packItem = await prisma.packCategoryItem.findUnique({
        where: { id },
        select: {
          gearId: true,
          index: true,
          category: {
            select: {
              id: true,
              pack: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      });

      if (!packItem) {
        throw new NotFoundError();
      }

      if (packItem.category.pack.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      const category = await prisma.packCategory.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          pack: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!category) {
        throw new NotFoundError();
      }

      if (category.pack.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      await decrementPackItemIndexesAfter(prisma, ctx, {
        categoryId: packItem.category.id,
        index: packItem.index,
      });

      await incrementPackItemIndexesFrom(prisma, ctx, {
        categoryId: categoryId,
        index,
      });

      return await prisma.packCategoryItem.update({
        where: { id },
        data: {
          categoryId,
          index,
        },
      });
    });
  }
);

export default movePackGearMutation;
