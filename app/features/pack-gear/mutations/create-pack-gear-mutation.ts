import { NotFoundError, resolver } from "blitz";

import db from "db";

import createPackGearSchema from "../schemas/create-pack-gear-schema";

const createPackGearMutation = resolver.pipe(
  resolver.zod(createPackGearSchema),
  resolver.authorize(),

  async ({ categoryId, packId, ...values }, ctx) => {
    return db.$transaction(async () => {
      const gear = await db.gear.create({
        data: {
          name: values.name,
          weight: values.weight,
          imageUrl: values.imageUrl,
          link: values.link,
          notes: values.notes,
          consumable: values.consumable,
          price: values.price,
          currency: values.currency,
          userId: ctx.session.userId,
        },
      });

      const pack = await db.pack.findFirst({
        where: {
          id: packId,
          userId: ctx.session.userId,
        },
      });

      if (!pack) {
        throw new NotFoundError();
      }

      const packCategory = await db.packCategory.findFirst({
        where: {
          id: categoryId,
          packId: pack.id,
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

      if (!packCategory) {
        throw new NotFoundError();
      }

      return db.packCategoryItem.create({
        data: {
          categoryId: categoryId,
          gearId: gear.id,
          worn: values.worn,
          index: packCategory._count?.items || 0,
        },
      });
    });
  }
);

export default createPackGearMutation;
