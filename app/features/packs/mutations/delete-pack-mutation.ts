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

    return db.$transaction(async (prisma) => {
      const packItems = await prisma.packCategoryItem.findMany({
        where: { category: { packId: id } },
      });

      await Promise.all(
        packItems.map(async (item) => {
          const inventoryItem = await prisma.categoryItem.findFirst({
            where: {
              gearId: item.gearId,
            },
          });

          const clone = await prisma.gear.findFirst({
            where: {
              clonedFromId: item.gearId,
            },
          });

          await prisma.packCategoryItem.delete({
            where: {
              id: item.id,
            },
          });

          if (!inventoryItem && !clone) {
            await prisma.gear.delete({ where: { id: item.gearId } });
          }
        })
      );

      await prisma.packCategory.deleteMany({
        where: { packId: id },
      });

      return prisma.pack.delete({
        where: { id },
      });
    });
  }
);

export default deletePackMutation;
