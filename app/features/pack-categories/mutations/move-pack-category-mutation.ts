import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import movePackCategorySchema from "../schemas/move-pack-category-schema";

const movePackCategoryMutation = resolver.pipe(
  resolver.zod(movePackCategorySchema),
  resolver.authorize(),

  async ({ id, index }, ctx) => {
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

      // First, every category after this one has it's index decremented
      await db.packCategory.updateMany({
        where: {
          packId: category.pack.id,
          index: { gt: category.index },
        },
        data: {
          index: { decrement: 1 },
        },
      });

      // Then, every category after or equal to the new index
      // has their indexes incremented
      await db.packCategory.updateMany({
        where: {
          packId: category.pack.id,
          pack: { userId: ctx.session.userId },
          index: { gte: index },
        },
        data: {
          index: {
            increment: 1,
          },
        },
      });

      // Save the category in it's new index
      return await db.packCategory.update({
        where: { id },
        data: {
          index,
        },
      });
    });
  }
);

export default movePackCategoryMutation;
