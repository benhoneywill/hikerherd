import { resolver } from "blitz";

import db from "db";

import listCategoryGearSchema from "../schemas/list-category-gear-schema";

const listCategoryGearQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(listCategoryGearSchema),

  async ({ type }, ctx) => {
    return db.categoryItem.findMany({
      include: {
        gear: true,
      },
      where: {
        category: {
          userId: ctx.session.userId,
          type,
        },
      },
    });
  }
);

export default listCategoryGearQuery;
