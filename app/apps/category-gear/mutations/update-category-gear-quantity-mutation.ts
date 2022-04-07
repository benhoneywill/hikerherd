import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import updateCategoryGearQuantitySchema from "../schemas/update-category-gear-quantity-schema";

const updateCategoryGearQuantityMutation = resolver.pipe(
  resolver.zod(updateCategoryGearQuantitySchema),
  resolver.authorize(),

  async ({ id, type }, ctx) => {
    return db.$transaction(async (prisma) => {
      const item = await prisma.categoryItem.findUnique({
        where: { id },
        select: {
          quantity: true,
          category: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!item) {
        throw new NotFoundError();
      }

      if (item.category.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      if (type === "decrement" && item.quantity === 0) {
        throw new Error("Can not decrement below 0");
      }

      if (type === "increment" && item.quantity === 99) {
        throw new Error("Can not increment above 99");
      }

      return prisma.categoryItem.update({
        where: { id },
        data: { quantity: { [type]: 1 } },
      });
    });
  }
);

export default updateCategoryGearQuantityMutation;
