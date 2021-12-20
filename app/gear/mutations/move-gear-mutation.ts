import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import moveGearSchema from "../schemas/move-gear-schema";

const moveGearMutation = resolver.pipe(
  resolver.zod(moveGearSchema),
  resolver.authorize(),

  async ({ id, ...values }, ctx) => {
    const gear = await db.gear.findUnique({
      where: { id },
    });

    if (!gear) {
      throw new NotFoundError();
    }

    if (gear.ownerId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return { id, ...values };
  },

  async ({ categoryId, ...values }, ctx) => {
    if (categoryId) {
      const category = await db.gearCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      if (category.ownerId !== ctx.session.userId) {
        throw new AuthorizationError();
      }
    }

    return { categoryId, ...values };
  },

  async ({ id, categoryId, index }) => {
    return db.$transaction(async () => {
      const from = await db.gearCategoryGear.findFirst({
        where: { gearId: id },
      });

      if (from) {
        await db.gearCategoryGear.updateMany({
          where: { categoryId: from.categoryId, index: { gt: from.index } },
          data: {
            index: {
              decrement: 1,
            },
          },
        });
      }

      await db.gearCategoryGear.updateMany({
        where: { categoryId: categoryId, index: { gte: index } },
        data: {
          index: {
            increment: 1,
          },
        },
      });

      return await db.gearCategoryGear.update({
        where: { gearId: id },
        data: {
          categoryId,
          index,
        },
      });
    });
  }
);

export type MoveGearResult = PromiseReturnType<typeof moveGearMutation>;

export default moveGearMutation;
