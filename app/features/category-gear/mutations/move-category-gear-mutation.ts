import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

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

      // Decrement the indexes of all the items after the current item
      // that are in the source category
      await prisma.categoryItem.updateMany({
        where: {
          categoryId: categoryItem.category.id,
          index: { gt: categoryItem.index },
        },
        data: {
          index: { decrement: 1 },
        },
      });

      // Increment the indexes of all items after the new location
      // within the destination category
      await prisma.categoryItem.updateMany({
        where: {
          categoryId,
          index: { gte: index },
        },
        data: {
          index: { increment: 1 },
        },
      });

      // Finally set the new index and category ID on the target item
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
