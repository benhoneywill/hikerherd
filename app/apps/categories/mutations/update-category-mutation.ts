import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import updateCategorySchema from "../schemas/update-category-schema";

const updateCategoryMutation = resolver.pipe(
  resolver.zod(updateCategorySchema),
  resolver.authorize(),

  async ({ id, name }, ctx) => {
    const category = await db.category.findFirst({
      where: { id },
    });

    if (!category) {
      throw new NotFoundError();
    }

    if (category.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return await db.category.update({
      where: { id },
      data: { name },
    });
  }
);

export default updateCategoryMutation;
