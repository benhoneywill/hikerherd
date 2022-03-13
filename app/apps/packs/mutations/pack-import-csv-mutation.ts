import type { PackCategory } from "db";

import { AuthorizationError, NotFoundError, resolver } from "blitz";

import { ZodError } from "zod";

import inventoryImportCsvMutation from "app/apps/inventory/mutations/inventory-import-csv-mutation";
import parseCsvFile from "app/helpers/parse-csv-file";
import CsvImportError from "app/apps/inventory/errors/csv-import-error";
import getNextPackCategoryIndex from "app/apps/pack-categories/functions/get-next-pack-category-index";
import getNextPackItemIndex from "app/apps/pack-gear/functions/get-next-pack-item-index";
import createPackGear from "app/apps/pack-gear/functions/create-pack-gear";

import db from "db";

import packImportCsvSchema from "../schemas/pack-import-csv-schema";

const packImportCsvMutation = resolver.pipe(
  resolver.authorize(),
  resolver.zod(packImportCsvSchema),

  async ({ id, file, addToInventory }, ctx) => {
    const pack = await db.pack.findUnique({
      where: { id },
      select: {
        userId: true,
      },
    });

    if (!pack) {
      throw new NotFoundError();
    }

    if (pack.userId !== ctx.session.userId) {
      throw new AuthorizationError();
    }

    if (addToInventory) {
      await inventoryImportCsvMutation({ file, type: "INVENTORY" }, ctx);
    }

    try {
      const gearItems = parseCsvFile(file);

      await db.$transaction(async (prisma) => {
        let nextCategoryIndex = await getNextPackCategoryIndex(prisma, ctx, {
          packId: id,
        });

        await Promise.all(
          Object.entries(gearItems).map(async ([categoryName, items]) => {
            let category: PackCategory;

            let existingCategory = await prisma.packCategory.findFirst({
              where: {
                packId: id,
                name: { equals: categoryName, mode: "insensitive" },
              },
            });

            if (existingCategory) {
              category = existingCategory;
            } else {
              const index = nextCategoryIndex;
              nextCategoryIndex = nextCategoryIndex + 1;

              category = await prisma.packCategory.create({
                data: {
                  packId: id,
                  name: categoryName,
                  index: index,
                },
              });
            }

            const nextItemIndex = await getNextPackItemIndex(prisma, ctx, {
              categoryId: category.id,
            });

            return Promise.all(
              items.map(async (item, index) => {
                return createPackGear(prisma, ctx, {
                  categoryId: category.id,
                  index: nextItemIndex + index,
                  values: {
                    ...item.gear,
                    worn: !!item.worn,
                    notes: item.notes,
                    quantity: item.quantity || 1,
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
