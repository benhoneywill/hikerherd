import type { User } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createCategory from "test/helpers/create-category";
import createGear from "test/helpers/create-gear";
import createCategoryItem from "test/helpers/create-category-item";
import getCsv from "test/data/get-csv";
import getCsvData from "test/data/get-csv-data";

import db from "db";

import inventoryImportCsvMutation from "./inventory-import-csv-mutation";

const categories = ["category 1", "category 2", "category 3"];
const data = getCsvData(categories);
const testCsv = getCsv(data);

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

    const categoryItemCount = await db.categoryItem.count();
    expect(categoryItemCount).toEqual(Object.values(data).flat().length);

    await Promise.all(
      categories.map(async (name, index) => {
        const category = await db.category.findFirst({
          where: { name },
          include: {
            items: { orderBy: { index: "asc" }, include: { gear: true } },
          },
        });

        if (!category) fail("Category not created");

        const csvCategory = data[name];
        if (!csvCategory) fail("Not matching csv category");

        expect(category.items.length).toEqual(csvCategory.length);
        expect(category.index).toEqual(index);

        category.items.forEach((item, index) => {
          const csvItem = csvCategory[index];

          if (!csvItem) fail("No matching CSV item");

          expect(item.index).toEqual(index);
          expect(item.gear.name).toEqual(csvItem.name);
          expect(item.gear.weight).toEqual(Number(csvItem.weight));
        });
      })
    );
  });

  it("should append to categories that already exist", async () => {
    const { ctx } = await createMockContext({ user });

    const existingCategoryName = categories[1];

    const existingCategory = await createCategory({
      userId: user.id,
      name: existingCategoryName,
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
    expect(categoryCount).toEqual(categories.length);

    const categoryItemCount = await db.categoryItem.count();
    expect(categoryItemCount).toEqual(Object.values(data).flat().length + 1);

    await Promise.all(
      categories.map(async (name, index) => {
        const isExisting = existingCategoryName === name;

        const category = await db.category.findFirst({
          where: { name },
          include: {
            items: { orderBy: { index: "asc" }, include: { gear: true } },
          },
        });

        if (!category) fail("Category not created");

        const csvCategory = data[name];
        if (!csvCategory) fail("Not matching csv category");

        if (isExisting) {
          expect(category.items.length).toEqual(csvCategory.length + 1);
          expect(category.index).toEqual(existingCategory.index);
        } else {
          expect(category.items.length).toEqual(csvCategory.length);
          expect(category.index).toEqual(
            index <= existingCategory.index ? index + 1 : index
          );
        }

        category.items.forEach((item, index) => {
          expect(item.index).toEqual(index);
        });
      })
    );
  });
});
