import { AuthorizationError, NotFoundError, resolver } from "blitz";

import idSchema from "app/modules/common/schemas/id-schema";

import db from "db";

const packGearQuery = resolver.pipe(
  resolver.authorize(),
  resolver.zod(idSchema),

  async ({ id }, ctx) => {
    const item = await db.packCategoryItem.findUnique({
      where: { id },
      select: {
        id: true,
        worn: true,
        quantity: true,
        gear: {
          select: {
            id: true,
            name: true,
            weight: true,
            price: true,
            currency: true,
            link: true,
            imageUrl: true,
            notes: true,
            consumable: true,
          },
        },
        category: {
          select: {
            pack: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundError();
    }

    if (item.category.pack.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    return item;
  }
);

export default packGearQuery;
