import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const categoryGearQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const item = await db.categoryItem.findFirst({
      where: { id, category: { userId: ctx.session.userId } },
      include: { gear: true },
    });

    if (!item) throw new NotFoundError();

    return item;
  }
);

export default categoryGearQuery;
