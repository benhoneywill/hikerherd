import { NotFoundError, resolver } from "blitz";

import db from "db";

import createCategoryGearSchema from "../schemas/create-category-gear-schema";

const createGearMutation = resolver.pipe(
  resolver.zod(createCategoryGearSchema),
  resolver.authorize(),

  async (values, ctx) => {
    return db.$transaction(async () => {
      const category = await db.category.findFirst({
        where: {
          id: values.categoryId,
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

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      return db.categoryItem.create({
        data: {
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
