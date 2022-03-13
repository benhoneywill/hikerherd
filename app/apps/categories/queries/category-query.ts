import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/schemas/id-schema";

import db from "db";

const categoryQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const category = await db.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        index: true,
        userId: true,
      },
    });

    if (!category) {
      throw new NotFoundError();
    }

    if (category.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return category;
  }
);

export default categoryQuery;
