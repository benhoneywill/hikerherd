import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import updatePackGearQuantitySchema from "../schemas/update-pack-gear-quantity-schema";

const updatePackGearQuantityMutation = resolver.pipe(
  resolver.zod(updatePackGearQuantitySchema),
  resolver.authorize(),

  async ({ id, type }, ctx) => {
    return db.$transaction(async (prisma) => {
      const item = await prisma.packCategoryItem.findUnique({
        where: { id },
        select: {
          quantity: true,
          category: {
            select: {
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

      if (type === "decrement" && item.quantity === 0) {
        throw new Error("Can not decrement below 0");
      }

      if (type === "increment" && item.quantity === 99) {
        throw new Error("Can not increment above 99");
      }

      return prisma.packCategoryItem.update({
        where: { id },
        data: { quantity: { [type]: 1 } },
      });
    });
  }
);

export default updatePackGearQuantityMutation;
