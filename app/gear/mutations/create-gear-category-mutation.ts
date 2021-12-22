import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import createGearCategorySchema from "../schemas/create-gear-category-schema";

const createGearCategoryMutation = resolver.pipe(
  resolver.zod(createGearCategorySchema),
  resolver.authorize(),

  async ({ name }, ctx) => {
    return db.$transaction(async () => {
      const highestIndexCat = await db.gearCategory.findFirst({
        where: { ownerId: ctx.session.userId },
        orderBy: { index: "desc" },
      });

      let index = 0;
      if (highestIndexCat) {
        index = highestIndexCat.index + 1;
      }

      return await db.gearCategory.create({
        data: {
          name,
          index,
          ownerId: ctx.session.userId,
        },
      });
    });
  }
);

export type CreateGearCategoryResult = PromiseReturnType<
  typeof createGearCategoryMutation
>;

export default createGearCategoryMutation;
