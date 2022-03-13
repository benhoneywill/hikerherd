import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/schemas/id-schema";
import conditionallyDeleteGear from "app/apps/gear/functions/conditionally-delete-gear";

import db from "db";

import decrementItemIndexesAfter from "../functions/decrement-item-indexes-after";

const deleteCategoryGearMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    const item = await db.categoryItem.findUnique({
      where: { id },
      select: {
        gearId: true,
        index: true,
        categoryId: true,
        category: { select: { userId: true } },
      },
    });

    if (!item) {
      throw new NotFoundError();
    }

    if (item.category.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    const deletedItem = await db.$transaction(async (prisma) => {
      await decrementItemIndexesAfter(prisma, ctx, {
        categoryId: item.categoryId,
        index: item.index,
      });

      return prisma.categoryItem.delete({
        where: { id },
      });
    });

    await conditionallyDeleteGear(db, ctx, {
      id: item.gearId,
    });

    return deletedItem;
  }
);

export default deleteCategoryGearMutation;
