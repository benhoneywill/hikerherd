import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const deletePackGearMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async (prisma) => {
      const item = await prisma.packCategoryItem.findUnique({
        where: { id },
        select: {
          gearId: true,
          index: true,
          category: {
            select: {
              id: true,
              pack: {
                select: {
                  userId: true,
                },
              },
            },
          },
        },
      });

      if (!item) {
        throw new NotFoundError();
      }

      if (item.category.pack.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

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

      // Decrement the index of all items after this one in the category
      await prisma.packCategoryItem.updateMany({
        where: {
          categoryId: item.category.id,
          index: { gt: item.index },
        },
        data: {
          index: { decrement: 1 },
        },
      });

      const result = await prisma.packCategoryItem.delete({
        where: {
          id,
        },
      });

      if (!inventoryItem && !clone) {
        await prisma.gear.delete({ where: { id: item.gearId } });
      }

      return result;
    });
  }
);

export default deletePackGearMutation;
