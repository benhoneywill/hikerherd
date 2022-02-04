import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const deletePackMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    const pack = await db.pack.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    if (pack.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return db.$transaction(async () => {
      const packItems = await db.packCategoryItem.findMany({
        where: { category: { packId: id } },
      });

      await Promise.all(
        packItems.map(async (item) => {
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
              id: item.id,
            },
          });

          if (!inventoryItem && !clone) {
            await db.gear.delete({ where: { id: item.gearId } });
          }
        })
      );

      await db.packCategory.deleteMany({
        where: { packId: id },
      });

      return db.pack.delete({
        where: { id },
      });
    });
  }
);

export default deletePackMutation;
