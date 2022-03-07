import type { User } from "db";

import { AuthenticationError } from "blitz";

import papaparse from "papaparse";

import createMockContext from "test/create-mock-context";

import db from "db";

import inventoryImportCsvMutation from "./inventory-import-csv-mutation";

const createCsv = () => {
  return papaparse.unparse([
    [
      "name",
      "category",
      "weight",
      "unit",
      "notes",
      "price",
      "currency",
      "link",
      "image",
      "consumable",
      "worn",
      "quantity",
    ],

    [
      "Gear 0",
      "category 0",
      "100",
      "gram",
      "Nice gear",
      "100",
      "£",
      "https://example.com/gear0",
      "https://example.com/gear0.png",
      "",
      "",
      "1",
    ],

    [
      "Gear 1",
      "category 0",
      "500",
      "gram",
      "I like it",
      "9.99",
      "$",
      "https://example.com/gear1",
      "https://example.com/gear1.png",
      "consumable",
      "",
      "1",
    ],

    [
      "Gear 0",
      "category 1",
      "100",
      "gram",
      "Nice gear",
      "100",
      "£",
      "https://example.com/gear0",
      "https://example.com/gear0.png",
      "",
      "",
      "1",
    ],

    ["Gear 2", "category 1", "1000", "gram", "", "", "$", "", "", "", "", "1"],

    [
      "Gear 0",
      "category 2",
      "100",
      "gram",
      "Nice gear",
      "100",
      "£",
      "https://example.com/gear0",
      "https://example.com/gear0.png",
      "",
      "",
      "1",
    ],

    [
      "Gear 1",
      "category 2",
      "500",
      "gram",
      "I like it",
      "9.99",
      "$",
      "https://example.com/gear1",
      "https://example.com/gear1.png",
      "consumable",
      "",
      "1",
    ],

    ["Gear 2", "category 2", "1000", "gram", "", "", "$", "", "", "", "", "1"],
  ]);
};

let user: User;

beforeEach(async () => {
  user = await db.user.create({
    data: {
      email: "example@hikerherd.com",
      username: "testuser",
      hashedPassword: "fakehash",
    },
  });
});

describe("inventoryImportCsvMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      inventoryImportCsvMutation({ type: "INVENTORY", file: "" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should create the correct database records", async () => {
    const { ctx } = await createMockContext({ user });

    await inventoryImportCsvMutation(
      { type: "INVENTORY", file: createCsv() },
      ctx
    );

    const gear0 = {
      name: "Gear 0",
      weight: 100,
      imageUrl: "https://example.com/gear0.png",
      link: "https://example.com/gear0",
      notes: "Nice gear",
      consumable: false,
      price: 10000,
      currency: "GBP",
      userId: user.id,
    };

    const gear1 = {
      name: "Gear 1",
      weight: 500,
      imageUrl: "https://example.com/gear1.png",
      link: "https://example.com/gear1",
      notes: "I like it",
      consumable: true,
      price: 999,
      currency: "USD",
      userId: user.id,
    };

    const gear2 = {
      name: "Gear 2",
      weight: 1000,
      userId: user.id,
    };

    const category0 = await db.category.findFirst({
      where: { name: "category 0" },
      include: {
        items: { include: { gear: true }, orderBy: { index: "asc" } },
      },
    });

    expect(category0?.index).toEqual(0);
    expect(category0?.items.length).toEqual(2);
    expect(category0?.items[0]?.gear).toMatchObject(gear0);
    expect(category0?.items[1]?.gear).toMatchObject(gear1);

    const category1 = await db.category.findFirst({
      where: { name: "category 1" },
      include: {
        items: { include: { gear: true }, orderBy: { index: "asc" } },
      },
    });

    expect(category1?.index).toEqual(1);
    expect(category1?.items.length).toEqual(2);
    expect(category1?.items[0]?.gear).toMatchObject(gear0);
    expect(category1?.items[1]?.gear).toMatchObject(gear2);

    const category2 = await db.category.findFirst({
      where: { name: "category 2" },
      include: {
        items: { include: { gear: true }, orderBy: { index: "asc" } },
      },
    });

    expect(category2?.index).toEqual(2);
    expect(category2?.items.length).toEqual(3);
    expect(category2?.items[0]?.gear).toMatchObject(gear0);
    expect(category2?.items[1]?.gear).toMatchObject(gear1);
    expect(category2?.items[2]?.gear).toMatchObject(gear2);
  });

  it("should append to categories that already exist", async () => {
    const { ctx } = await createMockContext({ user });

    await db.category.create({
      data: {
        name: "category 0",
        type: "INVENTORY",
        index: 0,
        userId: user.id,
        items: {
          create: {
            index: 0,
            gear: {
              create: {
                name: "Existing gear",
                weight: 1000,
                userId: user.id,
              },
            },
          },
        },
      },
    });

    await inventoryImportCsvMutation(
      { type: "INVENTORY", file: createCsv() },
      ctx
    );

    const categoryCount = await db.category.findFirst({
      select: { _count: true },
    });

    expect(categoryCount?._count?.items).toEqual(3);

    const category0 = await db.category.findFirst({
      where: { name: "category 0" },
      include: {
        items: { include: { gear: true }, orderBy: { index: "asc" } },
      },
    });

    expect(category0?.index).toEqual(0);
    expect(category0?.items.length).toEqual(3);

    expect(category0?.items[0]?.gear.name).toEqual("Existing gear");
    expect(category0?.items[1]?.gear.name).toEqual("Gear 0");
    expect(category0?.items[2]?.gear.name).toEqual("Gear 1");

    expect(category0?.items[1]?.index).toEqual(1);
    expect(category0?.items[2]?.index).toEqual(2);
  });
});
