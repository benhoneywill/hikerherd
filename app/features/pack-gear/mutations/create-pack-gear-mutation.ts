import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import createPackGearSchema from "../schemas/create-pack-gear-schema";

const createPackGearMutation = resolver.pipe(
  resolver.zod(createPackGearSchema),
  resolver.authorize(),

  async ({ categoryId, ...values }, ctx) => {
    return db.$transaction(async () => {
      const packCategory = await db.packCategory.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
          pack: {
            select: { userId: true },
          },
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

      if (packCategory.pack.userId !== ctx.session.userId) {
        throw new AuthorizationError();
      }

      return db.packCategoryItem.create({
        data: {
          worn: values.worn,
          index: packCategory._count?.items || 0,

          category: {
            connect: {
              id: categoryId,
            },
          },

          gear: {
            create: {
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
          },
        },
      });
    });
  }
);

export default createPackGearMutation;
