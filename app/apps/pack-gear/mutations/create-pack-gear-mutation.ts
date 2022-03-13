import { AuthorizationError, NotFoundError, resolver } from "blitz";

import findOrCreateCategoryByName from "app/apps/categories/functions/find-or-create-category-by-name";
import getNextItemIndex from "app/apps/category-gear/functions/get-next-item-index";

import db from "db";

import createPackGear from "../functions/create-pack-gear";
import getNextPackItemIndex from "../functions/get-next-pack-item-index";
import createPackGearSchema from "../schemas/create-pack-gear-schema";

const createPackGearMutation = resolver.pipe(
  resolver.zod(createPackGearSchema),
  resolver.authorize(),

  async ({ categoryId, ...values }, ctx) => {
    const packCategory = await db.packCategory.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        pack: {
          select: { userId: true },
        },
      },
    });

    if (!packCategory) {
      throw new NotFoundError();
    }

    if (packCategory.pack.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    const item = await db.$transaction(async (prisma) => {
      const index = await getNextPackItemIndex(prisma, ctx, { categoryId });

      return await createPackGear(prisma, ctx, {
        index,
        categoryId,
        values,
      });
    });

    await db.$transaction(async (prisma) => {
      const inventoryCategory = await findOrCreateCategoryByName(prisma, ctx, {
        categoryName: packCategory.name,
      });

      const index = await getNextItemIndex(prisma, ctx, {
        categoryId: inventoryCategory.id,
      });

      await prisma.categoryItem.create({
        data: {
          index,
          categoryId: inventoryCategory.id,
          gearId: item.gearId,
        },
      });
    });

    return item;
  }
);

export default createPackGearMutation;
