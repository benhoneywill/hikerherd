import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import moveGearSchema from "../schemas/move-gear-schema";

const moveGearMutation = resolver.pipe(
  resolver.zod(moveGearSchema),
  resolver.authorize(),

  async ({ id, categoryId, index }, ctx) => {
    return db.$transaction(async () => {
      const categoryItem = await db.categoryItem.findFirst({
        where: { id, category: { userId: ctx.session.userId } },
        include: {
          category: {
            select: {
              type: true,
            },
          },
        },
      });

      if (!categoryItem) {
        throw new NotFoundError();
      }

      const category = await db.category.findFirst({
        where: {
          id: categoryId,
          userId: ctx.session.userId,
          type: categoryItem.category.type,
        },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      await db.categoryItem.updateMany({
        where: {
          categoryId: categoryItem.categoryId,
          index: { gt: categoryItem.index },
        },
        data: {
          index: {
            decrement: 1,
          },
        },
      });

      await db.categoryItem.updateMany({
        where: { categoryId: categoryId, index: { gte: index } },
        data: {
          index: {
            increment: 1,
          },
        },
      });

      return await db.categoryItem.update({
        where: { id },
        data: {
          categoryId,
          index,
        },
      });
    });
  }
);

export type MoveGearResult = PromiseReturnType<typeof moveGearMutation>;

export default moveGearMutation;
