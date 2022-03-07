import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import createCategoryGearSchema from "../schemas/create-category-gear-schema";

const createGearMutation = resolver.pipe(
  resolver.zod(createCategoryGearSchema),
  resolver.authorize(),

  async ({ categoryId, ...values }, ctx) => {
    return db.$transaction(async (prisma) => {
      const category = await prisma.category.findUnique({
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

      return prisma.categoryItem.create({
        data: {
          // add the new item last in the category
          index: category._count?.items || 0,

          category: {
            connect: {
              id: category.id,
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

export default createGearMutation;
