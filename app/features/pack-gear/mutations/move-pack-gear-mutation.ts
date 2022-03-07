import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

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

      await prisma.packCategoryItem.updateMany({
        where: {
          categoryId: packItem.category.id,
          index: { gt: packItem.index },
        },
        data: {
          index: {
            decrement: 1,
          },
        },
      });

      await prisma.packCategoryItem.updateMany({
        where: { categoryId: categoryId, index: { gte: index } },
        data: {
          index: {
            increment: 1,
          },
        },
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
