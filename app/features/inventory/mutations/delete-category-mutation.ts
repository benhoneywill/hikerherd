import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import deleteCategorySchema from "../schemas/delete-category-schema";

const deleteCategoryMutation = resolver.pipe(
  resolver.zod(deleteCategorySchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async () => {
      const category = await db.category.findFirst({
        where: { id, userId: ctx.session.userId },
      });

      if (!category) {
        throw new NotFoundError();
      }

      const item = await db.categoryItem.findFirst({
        where: {
          categoryId: id,
        },
      });

      if (item) {
        throw new Error("Category still has items");
      }

      return db.category.delete({
        where: {
          id,
        },
      });
    });
  }
);

export type DeleteCategoryResult = PromiseReturnType<
  typeof deleteCategoryMutation
>;

export default deleteCategoryMutation;
