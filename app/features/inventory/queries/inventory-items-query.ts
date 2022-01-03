import type { PromiseReturnType } from "blitz";

import { resolver } from "blitz";

import db from "db";

import getInventoryItemsSchema from "../schemas/get-inventory-items-schema";

const inventoryItemsQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getInventoryItemsSchema),

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

export type InventoryItemsResult = PromiseReturnType<
  typeof inventoryItemsQuery
>;

export default inventoryItemsQuery;
