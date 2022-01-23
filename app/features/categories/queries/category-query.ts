import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const categoryQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const category = await db.category.findFirst({
      where: { userId: ctx.session.userId, id },
    });

    if (!category) throw new NotFoundError();

    return category;
  }
);

export default categoryQuery;
