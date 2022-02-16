import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import moveCategorySchema from "../schemas/move-category-schema";

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

      // First, every category after this one has it's index decremented
      await prisma.category.updateMany({
        where: {
          userId: ctx.session.userId,
          type: category.type,
          index: { gt: category.index },
        },
        data: {
          index: { decrement: 1 },
        },
      });

      // Then, every category after or equal to the new index
      // has their indexes incremented
      await prisma.category.updateMany({
        where: {
          userId: ctx.session.userId,
          type: category.type,
          index: { gte: index },
        },
        data: {
          index: {
            increment: 1,
          },
        },
      });

      // Save the category in it's new index
      return await prisma.category.update({
        where: { id },
        data: { index },
      });
    });
  }
);

export default moveCategoryMutation;
