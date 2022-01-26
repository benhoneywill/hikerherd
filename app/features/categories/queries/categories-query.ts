import { resolver } from "blitz";

import db from "db";

import categoriesQuerySchema from "../schemas/get-categories-schema";

const categoriesQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(categoriesQuerySchema),

  async ({ type }, ctx) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.userId },
      select: {
        categories: {
          where: { type },
          orderBy: { index: "asc" },
          select: {
            id: true,
            name: true,
            index: true,
            userId: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Something went wrong");
    }

    return user.categories;
  }
);

export default categoriesQuery;
