import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import deletePackCategorySchema from "../schemas/delete-pack-category-schema";

const deletePackCategoryMutation = resolver.pipe(
  resolver.zod(deletePackCategorySchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async () => {
      const category = await db.packCategory.findFirst({
        where: { id, pack: { userId: ctx.session.userId } },
      });

      if (!category) {
        throw new NotFoundError();
      }

      const item = await db.packCategoryItem.findFirst({
        where: {
          categoryId: id,
        },
      });

      if (item) {
        throw new Error("Category still has items");
      }

      return db.packCategory.delete({
        where: {
          id,
        },
      });
    });
  }
);

export type DeletePackCategoryResult = PromiseReturnType<
  typeof deletePackCategoryMutation
>;

export default deletePackCategoryMutation;
