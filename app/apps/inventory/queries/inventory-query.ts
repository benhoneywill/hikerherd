import { resolver } from "blitz";

import db from "db";

import getInventorySchema from "../schemas/get-inventory-schema";

const inventoryQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(getInventorySchema),

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
            items: {
              orderBy: { index: "asc" },
              select: {
                id: true,
                quantity: true,
                gear: {
                  select: {
                    name: true,
                    weight: true,
                    price: true,
                    currency: true,
                    consumable: true,
                    link: true,
                    notes: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return user?.categories || [];
  }
);

export default inventoryQuery;
