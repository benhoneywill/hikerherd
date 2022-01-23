import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const packGearQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const packGear = await db.packCategoryItem.findFirst({
      where: { id, category: { pack: { userId: ctx.session.userId } } },
      include: { gear: true },
    });

    if (!packGear) throw new NotFoundError();

    return packGear;
  }
);

export default packGearQuery;
