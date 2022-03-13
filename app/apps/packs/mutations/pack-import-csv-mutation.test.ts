import type { User, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createPack from "test/helpers/create-pack";
import getCsvData from "test/data/get-csv-data";
import getCsv from "test/data/get-csv";
import createPackCategory from "test/helpers/create-pack-category";
import createGear from "test/helpers/create-gear";
import createPackCategoryItem from "test/helpers/create-pack-category-item";

import db from "db";

import packImportCsvMutation from "./pack-import-csv-mutation";

const categories = ["category 1", "category 2", "category 3"];
const data = getCsvData(categories);
const testCsv = getCsv(data);

let user: User;
let pack: Pack;

beforeEach(async () => {
  user = await createUser();
  pack = await createPack({ userId: user.id });
});

describe("packImportCsvMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      packImportCsvMutation({ id: pack.id, file: testCsv }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the pack is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      packImportCsvMutation({ id: faker.datatype.uuid(), file: testCsv }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the pack does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      packImportCsvMutation({ id: pack.id, file: testCsv }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should create the correct database records", async () => {
    const { ctx } = await createMockContext({ user });

    await packImportCsvMutation({ id: pack.id, file: testCsv }, ctx);

    const categoryCount = await db.packCategory.count();
    expect(categoryCount).toEqual(categories.length);

    const categoryItemCount = await db.packCategoryItem.count();
    expect(categoryItemCount).toEqual(Object.values(data).flat().length);

    await Promise.all(
      categories.map(async (name, index) => {
        const category = await db.packCategory.findFirst({
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

    const existingCategory = await createPackCategory({
      packId: pack.id,
      name: existingCategoryName,
      index: 0,
    });

    const gear = await createGear({ userId: user.id });

    await createPackCategoryItem({
      categoryId: existingCategory.id,
      gearId: gear.id,
      index: 0,
    });

    await packImportCsvMutation({ id: pack.id, file: testCsv }, ctx);

    const categoryCount = await db.packCategory.count();
    expect(categoryCount).toEqual(categories.length);

    const categoryItemCount = await db.packCategoryItem.count();
    expect(categoryItemCount).toEqual(Object.values(data).flat().length + 1);

    await Promise.all(
      categories.map(async (name, index) => {
        const isExisting = existingCategoryName === name;

        const category = await db.packCategory.findFirst({
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
