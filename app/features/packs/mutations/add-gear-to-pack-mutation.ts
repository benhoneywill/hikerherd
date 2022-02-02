import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import addGearToPackSchema from "../schemas/add-gear-to-pack-schema";

const addGearToPackMutation = resolver.pipe(
  resolver.zod(addGearToPackSchema),
  resolver.authorize(),

  async ({ categoryId, gearId }, ctx) => {
    return db.$transaction(async () => {
      const category = await db.packCategory.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          pack: {
            select: {
              userId: true,
            },
          },
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

      if (category.pack.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      const gear = await db.gear.findUnique({ where: { id: gearId } });

      if (!gear) {
        throw new NotFoundError();
      }

      let itemGearId = gear.id;

      if (gear.userId !== ctx.session.userId) {
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

        itemGearId = clone.id;
      }

      return db.packCategoryItem.create({
        data: {
          categoryId,
          gearId: itemGearId,
          worn: false,
          index: category._count?.items || 0,
        },
      });
    });
  }
);

export default addGearToPackMutation;
