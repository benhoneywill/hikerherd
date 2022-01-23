import { resolver } from "blitz";

import db from "db";

import createCategorySchema from "../schemas/create-category-schema";

const createCategoryMutation = resolver.pipe(
  resolver.zod(createCategorySchema),
  resolver.authorize(),

  async ({ name, type }, ctx) => {
    return db.$transaction(async () => {
      const lastCategory = await db.category.findFirst({
        where: { userId: ctx.session.userId, type },
        orderBy: { index: "desc" },
      });

      const index = lastCategory ? lastCategory.index + 1 : 0;

      return await db.category.create({
        data: {
          name,
          index,
          type,
          userId: ctx.session.userId,
        },
      });
    });
  }
);

export default createCategoryMutation;
