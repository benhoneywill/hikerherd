import { resolver } from "blitz";

import db from "db";

import categoriesQuerySchema from "../schemas/get-categories-schema";

const categoriesQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(categoriesQuerySchema),

  async ({ type }, ctx) => {
    return db.category.findMany({
      where: { userId: ctx.session.userId, type },
    });
  }
);

export default categoriesQuery;
