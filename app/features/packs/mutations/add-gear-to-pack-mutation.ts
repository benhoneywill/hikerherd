import { NotFoundError, resolver } from "blitz";

import db from "db";

import addGearToPackSchema from "../schemas/add-gear-to-pack-schema";

const addGearToPackMutation = resolver.pipe(
  resolver.zod(addGearToPackSchema),
  resolver.authorize(),

  async ({ packId, categoryId, gearId }, ctx) => {
    const pack = await db.pack.findFirst({
      where: {
        id: packId,
        userId: ctx.session.userId,
      },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    return db.$transaction(async () => {
      const category = await db.packCategory.findFirst({
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

      if (!category) {
        throw new NotFoundError();
      }

      return db.packCategoryItem.create({
        data: {
          categoryId,
          gearId,
          worn: false,
          index: category._count?.items || 0,
        },
      });
    });
  }
);

export default addGearToPackMutation;
