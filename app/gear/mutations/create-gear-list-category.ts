import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import createGearListCategorySchema from "../schemas/create-gear-list-category-schema";

const createGearListCategoryMutation = resolver.pipe(
  resolver.zod(createGearListCategorySchema),
  resolver.authorize(),

  async ({ listId, name }, ctx) => {
    return db.$transaction(async () => {
      const highestIndexCat = await db.gearListCategory.findFirst({
        where: { listId, ownerId: ctx.session.userId },
        orderBy: { index: "desc" },
      });

      let index = 0;
      if (highestIndexCat) {
        index = highestIndexCat.index + 1;
      }

      return await db.gearListCategory.create({
        data: {
          name,
          index,
          listId,
          ownerId: ctx.session.userId,
        },
      });
    });
  }
);

export type CreateGearListCategoryResult = PromiseReturnType<
  typeof createGearListCategoryMutation
>;

export default createGearListCategoryMutation;
