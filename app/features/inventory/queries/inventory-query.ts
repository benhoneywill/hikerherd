import { resolver } from "blitz";

import db from "db";

import getInventorySchema from "../schemas/get-inventory-schema";

const inventoryQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getInventorySchema),

  async ({ type }, ctx) => {
    return db.category.findMany({
      where: { userId: ctx.session.userId, type },
      orderBy: { index: "asc" },
      include: {
        items: {
          orderBy: { index: "asc" },
          include: {
            gear: true,
          },
        },
      },
    });
  }
);

export default inventoryQuery;
