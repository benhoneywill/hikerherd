import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import createGearSchema from "../schemas/create-gear-schema";

const createGearMutation = resolver.pipe(
  resolver.zod(createGearSchema),
  resolver.authorize(),

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

  async ({ name, weight, categoryId }, ctx) => {
    return db.$transaction(async () => {
      const index = await db.gear.count({
        where: {
          ownerId: ctx.session.userId,
          categoryId,
        },
      });

      return db.gear.create({
        data: {
          name,
          weight,
          ownerId: ctx.session.userId,
          index,
          categoryId,
        },
      });
    });
  }
);

export type CreateGearResult = PromiseReturnType<typeof createGearMutation>;

export default createGearMutation;
