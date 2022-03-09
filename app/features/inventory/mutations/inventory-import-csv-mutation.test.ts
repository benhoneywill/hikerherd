import type { User } from "db";

import { AuthenticationError } from "blitz";

import papaparse from "papaparse";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import getCsvRow from "test/data/get-csv-row";
import csvHeadingRow from "test/data/csv-heading-row";
import createCategory from "test/helpers/create-category";
import createGear from "test/helpers/create-gear";
import createCategoryItem from "test/helpers/create-category-item";

import db from "db";

import inventoryImportCsvMutation from "./inventory-import-csv-mutation";

const categories = ["category 1", "category 2", "category 3"];

const items = categories.map((categoryName) => [
  getCsvRow({ categoryName }),
  getCsvRow({ categoryName }),
  getCsvRow({ categoryName }),
]);

const testCsv = papaparse.unparse([csvHeadingRow, ...items.flat()]);

let user: User;

beforeEach(async () => {
  user = await createUser();
});

describe("inventoryImportCsvMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      inventoryImportCsvMutation({ type: "INVENTORY", file: testCsv }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should create the correct database records", async () => {
    const { ctx } = await createMockContext({ user });

    await inventoryImportCsvMutation({ type: "INVENTORY", file: testCsv }, ctx);

    const categoryCount = await db.category.count();
    expect(categoryCount).toEqual(categories.length);

    categories.forEach(async (categoryName, categoryIndex) => {
      const category = await db.category.findFirst({
        where: { name: categoryName },
        include: {
          items: { orderBy: { index: "asc" } },
        },
      });

      expect(category?.name).toEqual(categoryName);
      expect(category?.index).toEqual(categoryIndex);
      expect(category?.items.length).toEqual(3);

      const categoryItems = items[categoryIndex];

      if (!categoryItems) throw new Error("Category should have items");

      categoryItems.forEach(async (item, itemIndex) => {
        const categoryItem = await db.categoryItem.findFirst({
          where: { categoryId: category?.id, index: itemIndex },
          include: { gear: true },
        });

        expect(categoryItem?.gear.name).toEqual(item[0]);
      });
    });
  });

  it("should append to categories that already exist", async () => {
    const { ctx } = await createMockContext({ user });

    const existingCategoryIndex = 1;

    const existingCategory = await createCategory({
      userId: user.id,
      name: categories[existingCategoryIndex],
      index: 0,
    });

    const gear = await createGear({ userId: user.id });

    await createCategoryItem({
      categoryId: existingCategory.id,
      gearId: gear.id,
      index: 0,
    });

    await inventoryImportCsvMutation({ type: "INVENTORY", file: testCsv }, ctx);

    const categoryCount = await db.category.count();

    expect(categoryCount).toEqual(3);

    categories.forEach(async (categoryName, categoryIndex) => {
      const isExisting = existingCategory.name === categoryName;

      const category = await db.category.findFirst({
        where: { name: categoryName },
        include: {
          items: { orderBy: { index: "asc" } },
        },
      });

      expect(category?.name).toEqual(categoryName);

      if (isExisting) {
        expect(category?.items.length).toEqual(4);
        expect(category?.index).toEqual(0);
      } else {
        expect(category?.items.length).toEqual(3);
        expect(category?.index).toEqual(
          categoryIndex < existingCategoryIndex
            ? categoryIndex + 1
            : categoryIndex
        );
      }

      const categoryItems = items[categoryIndex];

      if (!categoryItems) throw new Error("Category should have items");

      categoryItems.forEach(async (item, itemIndex) => {
        const index = isExisting ? itemIndex + 1 : itemIndex;

        const categoryItem = await db.categoryItem.findFirst({
          where: { categoryId: category?.id, index },
          include: { gear: true },
        });

        expect(categoryItem?.gear.name).toEqual(item[0]);
      });
    });
  });
});
