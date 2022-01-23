import { NotFoundError, resolver } from "blitz";

import db from "db";

import movePackCategorySchema from "../schemas/move-pack-category-schema";

const movePackCategoryMutation = resolver.pipe(
  resolver.zod(movePackCategorySchema),
  resolver.authorize(),

  async ({ id, index }, ctx) => {
    return db.$transaction(async () => {
      const Packcategory = await db.packCategory.findFirst({
        where: { id, pack: { userId: ctx.session.userId } },
      });

      if (!Packcategory) {
        throw new NotFoundError();
      }

      await db.packCategory.updateMany({
        where: {
          packId: Packcategory.packId,
          pack: { userId: ctx.session.userId },
          index: { gt: Packcategory.index },
        },
        data: {
          index: {
            decrement: 1,
          },
        },
      });

      await db.packCategory.updateMany({
        where: {
          packId: Packcategory.packId,
          pack: { userId: ctx.session.userId },
          index: { gte: index },
        },
        data: {
          index: {
            increment: 1,
          },
        },
      });

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
