import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import createGearSchema from "../schemas/create-gear-schema";

const createGearMutation = resolver.pipe(
  resolver.zod(createGearSchema),
  resolver.authorize(),

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

  async ({ name, weight, categoryId }, ctx) => {
    return db.$transaction(async () => {
      const index = await db.gearCategoryGear.count({
        where: {
          categoryId,
        },
      });

      return db.gear.create({
        data: {
          name,
          weight,
          ownerId: ctx.session.userId,
          category: {
            create: {
              categoryId,
              index,
            },
          },
        },
      });
    });
  }
);

export type CreateGearResult = PromiseReturnType<typeof createGearMutation>;

export default createGearMutation;
