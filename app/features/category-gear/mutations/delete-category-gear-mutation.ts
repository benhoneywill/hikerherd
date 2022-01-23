import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const deleteGearMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async () => {
      const item = await db.categoryItem.findFirst({
        where: { id, category: { userId: ctx.session.userId } },
      });

      if (!item) {
        throw new NotFoundError();
      }

      const packItem = await db.packCategoryItem.findFirst({
        where: {
          gearId: item.gearId,
        },
      });

      const clone = await db.gear.findFirst({
        where: {
          clonedFromId: item.gearId,
        },
      });

      await db.categoryItem.delete({
        where: {
          id,
        },
      });

      if (!packItem && !clone) {
        await db.gear.delete({ where: { id: item.gearId } });
      }
    });
  }
);

export default deleteGearMutation;
