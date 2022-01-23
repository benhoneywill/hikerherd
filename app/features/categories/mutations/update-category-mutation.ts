import { NotFoundError, resolver } from "blitz";

import db from "db";

import updateCategorySchema from "../schemas/update-category-schema";

const updateCategoryMutation = resolver.pipe(
  resolver.zod(updateCategorySchema),
  resolver.authorize(),

  async ({ id, name }, ctx) => {
    const category = await db.category.findFirst({
      where: { id, userId: ctx.session.userId },
    });

    if (!category) {
      throw new NotFoundError();
    }

    return await db.category.update({
      where: { id },
      data: {
        name,
      },
    });
  }
);

export default updateCategoryMutation;
