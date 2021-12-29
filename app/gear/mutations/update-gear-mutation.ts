import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import updateGearSchema from "../schemas/update-gear-schema";

const updateGearMutation = resolver.pipe(
  resolver.zod(updateGearSchema),
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
    const category = await db.gearCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    if (category.ownerId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return { categoryId, ...values };
  },

  async ({ id, name, weight, categoryId }) => {
    return await db.gear.update({
      where: { id },
      data: {
        name,
        weight,
        categoryId,
      },
    });
  }
);

export type UpdateGearResult = PromiseReturnType<typeof updateGearMutation>;

export default updateGearMutation;
