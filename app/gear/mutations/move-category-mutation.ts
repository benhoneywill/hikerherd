import type { PromiseReturnType } from "blitz";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import moveCategorySchema from "../schemas/move-category-schema";

const moveCategoryMutation = resolver.pipe(
  resolver.zod(moveCategorySchema),
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

    return { id, fromIndex: category.index, ...values };
  },

  async ({ id, index, fromIndex }, ctx) => {
    return db.$transaction(async () => {
      await db.gearCategory.updateMany({
        where: { ownerId: ctx.session.userId, index: { gt: fromIndex } },
        data: {
          index: {
            decrement: 1,
          },
        },
      });

      await db.gearCategory.updateMany({
        where: { ownerId: ctx.session.userId, index: { gte: index } },
        data: {
          index: {
            increment: 1,
          },
        },
      });

      return await db.gearCategory.update({
        where: { id },
        data: {
          index,
        },
      });
    });
  }
);

export type MoveCategoryResult = PromiseReturnType<typeof moveCategoryMutation>;

export default moveCategoryMutation;
