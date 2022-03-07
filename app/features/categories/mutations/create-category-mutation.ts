import { resolver } from "blitz";

import db from "db";

import createCategorySchema from "../schemas/create-category-schema";

const createCategoryMutation = resolver.pipe(
  resolver.zod(createCategorySchema),
  resolver.authorize(),

  async ({ name, type }, ctx) => {
    return db.$transaction(async (prisma) => {
      // Find the current user along with the category
      // with the highest index in the current type
      const user = await prisma.user.findUnique({
        where: { id: ctx.session.userId },
        select: {
          categories: {
            where: { type },
            orderBy: { index: "desc" },
            take: 1,
            select: { index: true },
          },
        },
      });

      if (!user) {
        throw new Error("Something went wrong");
      }

      // Find out what the index of the new category should be
      // based on the index of the current highest-index category
      const highestCategoryIndex = user.categories[0]?.index;
      const index = highestCategoryIndex ? highestCategoryIndex + 1 : 0;

      return await prisma.category.create({
        data: {
          name,
          type,
          index,
          userId: ctx.session.userId,
        },
      });
    });
  }
);

export default createCategoryMutation;
