import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import addToInventorySchema from "../schemas/add-to-inventory-schema";

const addToInventoryMutation = resolver.pipe(
  resolver.zod(addToInventorySchema),
  resolver.authorize(),

  async ({ categoryId, gearId }, ctx) => {
    return db.$transaction(async () => {
      const category = await db.category.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          userId: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
      });

      if (!category) {
        throw new NotFoundError();
      }

      if (category.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      const gear = await db.gear.findUnique({ where: { id: gearId } });

      if (!gear) {
        throw new NotFoundError();
      }

      // Clone the gear so that it belongs to the user
      const clone = await db.gear.create({
        data: {
          name: gear.name,
          imageUrl: gear.imageUrl,
          link: gear.link,
          notes: gear.notes,
          consumable: gear.consumable,
          weight: gear.weight,
          price: gear.price,
          currency: gear.currency,
          userId: ctx.session.userId,
          clonedFromId: gear.id,
        },
      });

      return db.categoryItem.create({
        data: {
          gearId: clone.id,
          categoryId: category.id,
          index: category._count?.items || 0,
        },
      });
    });
  }
);

export default addToInventoryMutation;
