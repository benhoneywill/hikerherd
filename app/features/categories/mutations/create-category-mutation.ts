import { resolver } from "blitz";

import db from "db";

import getNextCategoryIndex from "../functions/get-next-category-index";
import createCategorySchema from "../schemas/create-category-schema";

const createCategoryMutation = resolver.pipe(
  resolver.zod(createCategorySchema),
  resolver.authorize(),

  async ({ name, type }, ctx) => {
    return db.$transaction(async (prisma) => {
      const index = await getNextCategoryIndex(prisma, ctx, { type });

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
