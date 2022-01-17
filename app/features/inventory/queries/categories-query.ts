import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import getCategoriesSchema from "../schemas/get-categories-schema";

const categoriesQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getCategoriesSchema),

  async ({ type }, ctx) => {
    return db.category.findMany({
      where: { userId: ctx.session.userId, type },
    });
  }
);

export type CategoriesResult = PromiseReturnType<typeof categoriesQuery>;

export default categoriesQuery;
