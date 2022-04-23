import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/schemas/id-schema";
import conditionallyDeleteGear from "app/apps/gear/functions/conditionally-delete-gear";

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

    const packItems = await db.packCategoryItem.findMany({
      where: { category: { packId: id } },
    });

    await db.packCategoryItem.deleteMany({
      where: {
        id: { in: packItems.map(({ id }) => id) },
      },
    });

    await db.packCategory.deleteMany({
      where: { packId: id },
    });

    await conditionallyDeleteGear(db, ctx, {
      ids: packItems.map(({ gearId }) => gearId),
    });

    return db.pack.delete({
      where: { id },
    });
  }
);

export default deletePackMutation;
