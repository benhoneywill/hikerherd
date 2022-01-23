import { NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const deletePackGearMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async () => {
      const item = await db.packCategoryItem.findFirst({
        where: { id, category: { pack: { userId: ctx.session.userId } } },
      });

      if (!item) {
        throw new NotFoundError();
      }

      const inventoryItem = await db.categoryItem.findFirst({
        where: {
          gearId: item.gearId,
        },
      });

      const clone = await db.gear.findFirst({
        where: {
          clonedFromId: item.gearId,
        },
      });

      await db.packCategoryItem.delete({
        where: {
          id,
        },
      });

      if (!inventoryItem && !clone) {
        await db.gear.delete({ where: { id: item.gearId } });
      }
    });
  }
);

export default deletePackGearMutation;
