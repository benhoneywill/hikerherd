import type { ParsedCsvItem } from "app/modules/common/helpers/item-to-csv-format";

import { resolver } from "blitz";

import papaparse from "papaparse";
import { ZodError } from "zod";

import parseCsvItems from "app/modules/common/helpers/parse-csv-items";

import db from "db";

import inventoryImportSchema from "../schemas/inventory-import-schema";
import CsvImportError from "../errors/csv-import-error";

const inventoryImportMutation = resolver.pipe(
  resolver.authorize(),
  resolver.zod(inventoryImportSchema),

  async ({ file, type }, ctx) => {
    const { data } = papaparse.parse(file, {
      header: true,
      dynamicTyping: {
        weight: true,
        price: true,
        currency: true,
        consumable: true,
        worn: true,
        quantity: true,
        notes: true,
        link: true,
        image: true,
      },
    });

    try {
      const gearItems = parseCsvItems(data);

      const groupedItems = gearItems.reduce((groups, item) => {
        return {
          ...groups,
          [item.category]: [...(groups[item.category] || []), item],
        };
      }, {} as { [name: string]: ParsedCsvItem[] });

      await db.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: { id: ctx.session.userId },
          select: {
            categories: {
              where: { type },
              orderBy: { index: "desc" },
              take: 1,
              select: { index: true },
            },
          },
        });

        let highestCategoryIndex = user?.categories[0]?.index || -1;

        await Promise.all(
          Object.entries(groupedItems).map(async ([categoryName, items]) => {
            let category = await prisma.category.findFirst({
              where: {
                userId: ctx.session.userId,
                name: { equals: categoryName, mode: "insensitive" },
                type,
              },
            });

            if (!category) {
              const index = highestCategoryIndex + 1;
              highestCategoryIndex = index;

              category = await prisma.category.create({
                data: {
                  userId: ctx.session.userId,
                  name: categoryName,
                  type,
                  index: index,
                },
              });
            }

            const lastItem = await prisma.categoryItem.findFirst({
              where: { id: category.id },
              orderBy: { index: "desc" },
              take: 1,
              select: { index: true },
            });

            let highestItemIndex = lastItem?.index || -1;

            return Promise.all(
              items.map(async (item) => {
                const index = highestItemIndex + 1;
                highestItemIndex = index;

                return prisma.categoryItem.create({
                  data: {
                    index,

                    category: {
                      connect: {
                        id: category?.id,
                      },
                    },

                    gear: {
                      create: {
                        name: item.gear.name,
                        weight: item.gear.weight,
                        imageUrl: item.gear.imageUrl,
                        link: item.gear.link,
                        notes: item.gear.notes,
                        consumable: item.gear.consumable,
                        price: item.gear.price,
                        currency: item.gear.currency,
                        userId: ctx.session.userId,
                      },
                    },
                  },
                });
              })
            );
          })
        );
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw new CsvImportError(error);
      } else {
        throw error;
      }
    }
  }
);

export default inventoryImportMutation;
