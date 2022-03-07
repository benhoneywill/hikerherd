import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const deleteCategoryGearMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async (prisma) => {
      const item = await prisma.categoryItem.findUnique({
        where: { id },
        select: {
          gearId: true,
          categoryId: true,
          index: true,
          category: { select: { userId: true } },
        },
      });

      if (!item?.category.userId) {
        throw new NotFoundError();
      }

      if (item.category.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      // Decrement the index of all items after this one in the category
      await prisma.categoryItem.updateMany({
        where: {
          categoryId: item.categoryId,
          index: { gt: item.index },
        },
        data: {
          index: { decrement: 1 },
        },
      });

      const packItem = await prisma.packCategoryItem.findFirst({
        where: { gearId: item.gearId },
        select: { id: true },
      });

      const clone = await prisma.gear.findFirst({
        where: { clonedFromId: item.gearId },
        select: { id: true },
      });

      const deletedItem = await prisma.categoryItem.delete({
        where: { id },
      });

      // If the gear is not used in any packs, and has no clones
      // then it should be deleted as well.
      if (!packItem && !clone) {
        await prisma.gear.delete({ where: { id: item.gearId } });
      }

      return deletedItem;
    });
  }
);

export default deleteCategoryGearMutation;
