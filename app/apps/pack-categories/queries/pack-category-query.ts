import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/schemas/id-schema";

import db from "db";

const packCategoryQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const category = await db.packCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        pack: {
          select: { id: true, userId: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError();
    }

    if (category.pack.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return category;
  }
);

export default packCategoryQuery;
