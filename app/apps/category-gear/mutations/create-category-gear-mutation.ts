import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import createCategoryGearSchema from "../schemas/create-category-gear-schema";
import getNextItemIndex from "../functions/get-next-item-index";
import createCategoryGear from "../functions/create-category-gear";

const createGearMutation = resolver.pipe(
  resolver.zod(createCategoryGearSchema),
  resolver.authorize(),

  async ({ categoryId, ...values }, ctx) => {
    const category = await db.category.findUnique({
      where: { id: categoryId },
      select: { id: true, userId: true },
    });

    if (!category) {
      throw new NotFoundError();
    }

    if (category.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return db.$transaction(async (prisma) => {
      const index = await getNextItemIndex(prisma, ctx, {
        categoryId: category.id,
      });

      return createCategoryGear(prisma, ctx, { categoryId, index, values });
    });
  }
);

export default createGearMutation;
