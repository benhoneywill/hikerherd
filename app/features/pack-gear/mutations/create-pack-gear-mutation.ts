import { AuthorizationError, NotFoundError, resolver } from "blitz";

import db from "db";

import createPackGearSchema from "../schemas/create-pack-gear-schema";

const createPackGearMutation = resolver.pipe(
  resolver.zod(createPackGearSchema),
  resolver.authorize(),

  async ({ categoryId, ...values }, ctx) => {
    return db.$transaction(async (prisma) => {
      const packCategory = await prisma.packCategory.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
          name: true,
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

      const item = await prisma.packCategoryItem.create({
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

      const inventoryCategory = await prisma.category.findFirst({
        where: {
          userId: ctx.session.userId,
          type: "INVENTORY",
          name: { equals: packCategory.name, mode: "insensitive" },
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

      if (!inventoryCategory) {
        const user = await prisma.user.findUnique({
          where: { id: ctx.session.userId },
          select: {
            categories: {
              where: { type: "INVENTORY" },
              orderBy: { index: "desc" },
              take: 1,
              select: { index: true },
            },
          },
        });

        const index = user?.categories[0] ? user?.categories[0]?.index + 1 : 0;

        await prisma.category.create({
          data: {
            userId: ctx.session.userId,
            type: "INVENTORY",
            name: packCategory.name,
            index,
            items: {
              create: {
                index: 0,
                gearId: item.gearId,
              },
            },
          },
        });
      } else {
        await prisma.categoryItem.create({
          data: {
            index: inventoryCategory._count?.items || 0,
            categoryId: inventoryCategory.id,
            gearId: item.gearId,
          },
        });
      }

      return item;
    });
  }
);

export default createPackGearMutation;
