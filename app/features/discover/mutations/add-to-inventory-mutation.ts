import { NotFoundError, resolver } from "blitz";

import db from "db";

import addToInventorySchema from "../schemas/add-to-inventory-schema";

const addToInventoryMutation = resolver.pipe(
  resolver.zod(addToInventorySchema),
  resolver.authorize(),

  async ({ categoryId, gearId, type }, ctx) => {
    return db.$transaction(async () => {
      const category = await db.category.findFirst({
        where: {
          id: categoryId,
          type,
          userId: ctx.session.userId,
        },
        select: {
          id: true,
          _count: {
            select: {
              items: true,
            },
          },
        },
      });

      const gear = await db.gear.findUnique({ where: { id: gearId } });

      if (!gear || !category) {
        throw new NotFoundError();
      }

      return db.categoryItem.create({
        data: {
          gearId: gear.id,
          categoryId: category.id,
          index: category._count?.items || 0,
        },
      });
    });
  }
);

export default addToInventoryMutation;
