import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import deletePackGearSchema from "../schemas/delete-pack-gear-schema";

const deletePackGearMutation = resolver.pipe(
  resolver.zod(deletePackGearSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async () => {
      const item = await db.packCategoryItem.findFirst({
        where: { id, category: { pack: { userId: ctx.session.userId } } },
      });

      if (!item) {
        throw new NotFoundError();
      }

      const inventoryItem = await db.categoryItem.findFirst({
        where: {
          gearId: item.gearId,
        },
      });

      const clone = await db.gear.findFirst({
        where: {
          clonedFromId: item.gearId,
        },
      });

      await db.packCategoryItem.delete({
        where: {
          id,
        },
      });

      if (!inventoryItem && !clone) {
        await db.gear.delete({ where: { id: item.gearId } });
      }
    });
  }
);

export type DeletePackGearResult = PromiseReturnType<
  typeof deletePackGearMutation
>;

export default deletePackGearMutation;
