import type { PromiseReturnType } from "blitz";

import { NotFoundError, resolver } from "blitz";

import db from "db";

import moveCategorySchema from "../schemas/move-category-schema";

const moveCategoryMutation = resolver.pipe(
  resolver.zod(moveCategorySchema),
  resolver.authorize(),

  async ({ id, index }, ctx) => {
    return db.$transaction(async () => {
      const category = await db.category.findFirst({
        where: { id, userId: ctx.session.userId },
      });

      if (!category) {
        throw new NotFoundError();
      }

      await db.category.updateMany({
        where: {
          userId: ctx.session.userId,
          type: category.type,
          index: { gt: category.index },
        },
        data: {
          index: {
            decrement: 1,
          },
        },
      });

      await db.category.updateMany({
        where: {
          userId: ctx.session.userId,
          type: category.type,
          index: { gte: index },
        },
        data: {
          index: {
            increment: 1,
          },
        },
      });

      return await db.category.update({
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
