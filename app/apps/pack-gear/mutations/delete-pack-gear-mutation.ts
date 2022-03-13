import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/schemas/id-schema";
import conditionallyDeleteGear from "app/apps/gear/functions/conditionally-delete-gear";

import db from "db";

import decrementPackItemIndexesAfter from "../functions/decrement-pack-item-indexes-after";

const deletePackGearMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    const item = await db.packCategoryItem.findUnique({
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

    const deletedItem = await db.$transaction(async (prisma) => {
      await decrementPackItemIndexesAfter(prisma, ctx, {
        categoryId: item.category.id,
        index: item.index,
      });

      return prisma.packCategoryItem.delete({
        where: {
          id,
        },
      });
    });

    await conditionallyDeleteGear(db, ctx, {
      id: item.gearId,
    });

    return deletedItem;
  }
);

export default deletePackGearMutation;
