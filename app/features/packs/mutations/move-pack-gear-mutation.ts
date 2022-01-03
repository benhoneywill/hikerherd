import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import movePackGearSchema from "../schemas/move-pack-gear-schema";

const movePackGearMutation = resolver.pipe(
  resolver.zod(movePackGearSchema),
  resolver.authorize(),

  async ({ id, categoryId, packId, index }, ctx) => {
    return db.$transaction(async () => {
      const packItem = await db.packCategoryItem.findFirst({
        where: {
          id,
          category: { packId, pack: { userId: ctx.session.userId } },
        },
      });

      if (!packItem) {
        throw new NotFoundError();
      }

      const category = await db.packCategory.findFirst({
        where: {
          packId,
          pack: { userId: ctx.session.userId },
          id: categoryId,
        },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      await db.packCategoryItem.updateMany({
        where: {
          categoryId: packItem.categoryId,
          index: { gt: packItem.index },
        },
        data: {
          index: {
            decrement: 1,
          },
        },
      });

      await db.packCategoryItem.updateMany({
        where: { categoryId: categoryId, index: { gte: index } },
        data: {
          index: {
            increment: 1,
          },
        },
      });

      return await db.packCategoryItem.update({
        where: { id },
        data: {
          categoryId,
          index,
        },
      });
    });
  }
);

export type MovePackGearResult = PromiseReturnType<typeof movePackGearMutation>;

export default movePackGearMutation;
