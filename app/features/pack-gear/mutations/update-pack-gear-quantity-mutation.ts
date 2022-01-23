import { NotFoundError, resolver } from "blitz";

import db from "db";

import updatePackGearQuantitySchema from "../schemas/update-pack-gear-quantity-schema";

const updatePackGearQuantityMutation = resolver.pipe(
  resolver.zod(updatePackGearQuantitySchema),
  resolver.authorize(),

  async ({ id, type }, ctx) => {
    return db.$transaction(async () => {
      const item = await db.packCategoryItem.findFirst({
        where: { id, category: { pack: { userId: ctx.session.userId } } },
      });

      if (!item) {
        throw new NotFoundError();
      }

      if (type === "decrement" && item.quantity === 0) {
        throw new Error("Can not decrement below 0");
      }

      return db.packCategoryItem.update({
        where: { id },
        data: { quantity: { [type]: 1 } },
      });
    });
  }
);

export default updatePackGearQuantityMutation;
