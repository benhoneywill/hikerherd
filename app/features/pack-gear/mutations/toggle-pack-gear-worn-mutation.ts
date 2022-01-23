import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const togglePackGearWornMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    const item = await db.packCategoryItem.findFirst({
      where: { id, category: { pack: { userId: ctx.session.userId } } },
    });

    if (!item) {
      throw new NotFoundError();
    }

    return db.packCategoryItem.update({
      where: { id },
      data: { worn: !item.worn },
    });
  }
);

export default togglePackGearWornMutation;
