import type { Category } from "db";

import { resolver } from "blitz";

import { ZodError } from "zod";

import parseCsvFile from "app/helpers/parse-csv-file";
import getNextCategoryIndex from "app/apps/categories/functions/get-next-category-index";
import getNextItemIndex from "app/apps/category-gear/functions/get-next-item-index";
import createCategoryGear from "app/apps/category-gear/functions/create-category-gear";
import PrismaError from "app/errors/prisma-error";

import db, { Prisma } from "db";

import inventoryImportSchema from "../schemas/inventory-import-schema";
import CsvImportError from "../errors/csv-import-error";

const inventoryImportCsvMutation = resolver.pipe(
  resolver.authorize(),
  resolver.zod(inventoryImportSchema),

  async ({ file, type }, ctx) => {
    try {
      const gearItems = parseCsvFile(file);

      await db.$transaction(
        async (prisma) => {
          let nextCategoryIndex = await getNextCategoryIndex(prisma, ctx, {
            type,
          });

          await Promise.all(
            Object.entries(gearItems).map(async ([categoryName, items]) => {
              let category: Category;

              const existingCategory = await prisma.category.findFirst({
                where: {
                  userId: ctx.session.userId,
                  name: { equals: categoryName, mode: "insensitive" },
                  type,
                },
              });

              if (existingCategory) {
                category = existingCategory;
              } else {
                const index = nextCategoryIndex;
                nextCategoryIndex = nextCategoryIndex + 1;

                category = await prisma.category.create({
                  data: {
                    userId: ctx.session.userId,
                    name: categoryName,
                    type,
                    index,
                  },
                });
              }

              const nextItemIndex = await getNextItemIndex(prisma, ctx, {
                categoryId: category.id,
              });

              return Promise.all(
                items.map(async (item, index) => {
                  return createCategoryGear(prisma, ctx, {
                    index: nextItemIndex + index,
                    categoryId: category.id,
                    values: item.gear,
                  });
                })
              );
            })
          );
        },
        { timeout: 12000 }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new CsvImportError(error);
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaError(error, {
          timeout:
            "The connection timed out, your CSV file may be too big. Try splitting it up and try again.",
        });
      } else {
        throw error;
      }
    }
  }
);

export default inventoryImportCsvMutation;
