import type { ParsedCsvItem } from "app/modules/common/helpers/item-to-csv-format";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import { ZodError } from "zod";

import inventoryImportCsvMutation from "app/features/inventory/mutations/inventory-import-csv-mutation";
import parseCsvFile from "app/modules/common/helpers/parse-csv-file";
import CsvImportError from "app/features/inventory/errors/csv-import-error";

import db from "db";

import packImportCsvSchema from "../schemas/pack-import-csv-schema";

const packImportCsvMutation = resolver.pipe(
  resolver.authorize(),
  resolver.zod(packImportCsvSchema),

  async ({ id, file, addToInventory }, ctx) => {
    if (addToInventory) {
      await inventoryImportCsvMutation({ file, type: "INVENTORY" }, ctx);
    }

    try {
      const gearItems = parseCsvFile(file);

      const groupedItems = gearItems.reduce((groups, item) => {
        return {
          ...groups,
          [item.category]: [...(groups[item.category] || []), item],
        };
      }, {} as { [name: string]: ParsedCsvItem[] });

      await db.$transaction(async (prisma) => {
        const pack = await prisma.pack.findUnique({
          where: { id },
          select: {
            userId: true,
            categories: {
              orderBy: { index: "desc" },
              take: 1,
              select: { index: true },
            },
          },
        });

        if (!pack) {
          throw new NotFoundError();
        }

        if (pack.userId !== ctx.session.userId) {
          throw new AuthorizationError();
        }

        let highestCategoryIndex = pack?.categories[0]?.index || -1;

        await Promise.all(
          Object.entries(groupedItems).map(async ([categoryName, items]) => {
            let category = await prisma.packCategory.findFirst({
              where: {
                packId: id,
                name: { equals: categoryName, mode: "insensitive" },
              },
            });

            if (!category) {
              const index = highestCategoryIndex + 1;
              highestCategoryIndex = index;

              category = await prisma.packCategory.create({
                data: {
                  packId: id,
                  name: categoryName,
                  index: index,
                },
              });
            }

            const lastItem = await prisma.packCategoryItem.findFirst({
              where: { categoryId: category.id },
              orderBy: { index: "desc" },
              take: 1,
              select: { index: true },
            });

            let highestItemIndex = lastItem?.index || -1;

            return Promise.all(
              items.map(async (item) => {
                const index = highestItemIndex + 1;
                highestItemIndex = index;

                return prisma.packCategoryItem.create({
                  data: {
                    index,
                    worn: !!item.worn,
                    notes: item.notes,
                    quantity: item.quantity || 1,

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

export default packImportCsvMutation;
