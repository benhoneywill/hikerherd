import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import deleteGearSchema from "../schemas/delete-gear-schema";

const deleteGearMutation = resolver.pipe(
  resolver.zod(deleteGearSchema),
  resolver.authorize(),

  async ({ id }, ctx) => {
    return db.$transaction(async () => {
      const item = await db.categoryItem.findFirst({
        where: { id, category: { userId: ctx.session.userId } },
      });

      if (!item) {
        throw new NotFoundError();
      }

      const packItem = await db.packCategoryItem.findFirst({
        where: {
          gearId: item.gearId,
        },
      });

      const clone = await db.gear.findFirst({
        where: {
          clonedFromId: item.gearId,
        },
      });

      await db.categoryItem.delete({
        where: {
          id,
        },
      });

      if (!packItem && !clone) {
        await db.gear.delete({ where: { id: item.gearId } });
      }
    });
  }
);

export type DeleteGearResult = PromiseReturnType<typeof deleteGearMutation>;

export default deleteGearMutation;
