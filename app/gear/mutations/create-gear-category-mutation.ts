import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import createGearCategorySchema from "../schemas/create-gear-category-schema";

const createGearCategoryMutation = resolver.pipe(
  resolver.zod(createGearCategorySchema),
  resolver.authorize(),

  async ({ name }, ctx) => {
    return await db.gearCategory.create({
      data: {
        name,
        ownerId: ctx.session.userId,
      },
    });
  }
);

export type CreateGearCategoryResult = PromiseReturnType<
  typeof createGearCategoryMutation
>;

export default createGearCategoryMutation;
