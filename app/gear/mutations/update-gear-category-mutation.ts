import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import updateGearCategorySchema from "../schemas/update-gear-category-schema";

const updateGearCategoryMutation = resolver.pipe(
  resolver.zod(updateGearCategorySchema),
  resolver.authorize(),

  async ({ id, ...values }, ctx) => {
    const category = await db.gearCategory.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundError();
    }

    if (category.ownerId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return { id, ...values };
  },

  async ({ id, name }) => {
    return await db.gearCategory.update({
      where: { id },
      data: {
        name,
      },
    });
  }
);

export type UpdateGearCategoryResult = PromiseReturnType<
  typeof updateGearCategoryMutation
>;

export default updateGearCategoryMutation;
