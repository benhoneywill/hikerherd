import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";
import conditionallyDeleteGear from "app/features/gear/functions/conditionally-delete-gear";

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
          await prisma.packCategoryItem.delete({
            where: {
              id: item.id,
            },
          });

          await conditionallyDeleteGear(prisma, ctx, {
            id: item.gearId,
          });
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
