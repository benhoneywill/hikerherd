import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import updatePackCategorySchema from "../schemas/update-pack-category-schema";

const updatePackCategoryMutation = resolver.pipe(
  resolver.zod(updatePackCategorySchema),
  resolver.authorize(),

  async ({ id, name }, ctx) => {
    const category = await db.packCategory.findUnique({
      where: { id },
      select: {
        pack: {
          select: { userId: true, id: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError();
    }

    if (category.pack.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return await db.packCategory.update({
      where: { id },
      data: {
        name,
      },
    });
  }
);

export default updatePackCategoryMutation;
