import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/schemas/id-schema";
import conditionallyDeleteGear from "app/apps/gear/functions/conditionally-delete-gear";

import db from "db";

import decrementPackCategoryIndexesAfter from "../functions/decrement-pack-category-indexes-after";

const deletePackCategoryMutation = resolver.pipe(
  resolver.zod(idSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async (prisma) => {
      const category = await prisma.packCategory.findUnique({
        where: { id },
        select: {
          index: true,
          pack: {
            select: { id: true, userId: true },
          },
          items: {
            select: { gearId: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundError();
      }

      if (category.pack.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      await decrementPackCategoryIndexesAfter(prisma, ctx, {
        packId: category.pack.id,
        index: category.index,
      });

      await prisma.packCategoryItem.deleteMany({
        where: { categoryId: id },
      });

      await Promise.all(
        category.items.map(({ gearId }) =>
          conditionallyDeleteGear(prisma, ctx, { id: gearId })
        )
      );

      return prisma.packCategory.delete({
        where: { id },
      });
    });
  }
);

export default deletePackCategoryMutation;
