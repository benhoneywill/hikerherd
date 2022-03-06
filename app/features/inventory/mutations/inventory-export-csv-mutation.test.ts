import type { User } from "db";

import { AuthenticationError } from "blitz";

import papaparse from "papaparse";

import createMockContext from "test/create-mock-context";

import db from "db";

import inventoryExportCsvMutation from "./inventory-export-csv-mutation";

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

describe("inventoryExportCsvMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      inventoryExportCsvMutation({ type: "INVENTORY" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should return the correct CSV", async () => {
    const { ctx } = await createMockContext({ user });

    const category0 = await db.category.create({
      data: {
        name: "category 0",
        type: "INVENTORY",
        index: 0,
        userId: user.id,
      },
    });

    const category1 = await db.category.create({
      data: {
        name: "category 1",
        type: "INVENTORY",
        index: 1,
        userId: user.id,
      },
    });

    const category2 = await db.category.create({
      data: {
        name: "category 2",
        type: "INVENTORY",
        index: 2,
        userId: user.id,
      },
    });

    const gear0 = await db.gear.create({
      data: {
        name: "Gear 0",
        weight: 100,
        imageUrl: "https://example.com/gear0.png",
        link: "https://example.com/gear0",
        notes: "Nice gear",
        consumable: false,
        price: 10000,
        currency: "GBP",
        userId: user.id,
      },
    });

    const gear1 = await db.gear.create({
      data: {
        name: "Gear 1",
        weight: 500,
        imageUrl: "https://example.com/gear1.png",
        link: "https://example.com/gear1",
        notes: "I like it",
        consumable: true,
        price: 999,
        currency: "USD",
        userId: user.id,
      },
    });

    const gear2 = await db.gear.create({
      data: {
        name: "Gear 2",
        weight: 1000,
        userId: user.id,
      },
    });

    await db.categoryItem.createMany({
      data: [
        {
          index: 0,
          gearId: gear0.id,
          categoryId: category0.id,
        },
        {
          index: 1,
          gearId: gear1.id,
          categoryId: category0.id,
        },
        {
          index: 0,
          gearId: gear0.id,
          categoryId: category1.id,
        },
        {
          index: 1,
          gearId: gear2.id,
          categoryId: category1.id,
        },
        {
          index: 0,
          gearId: gear0.id,
          categoryId: category2.id,
        },
        {
          index: 1,
          gearId: gear1.id,
          categoryId: category2.id,
        },
        {
          index: 2,
          gearId: gear2.id,
          categoryId: category2.id,
        },
      ],
    });

    const result = await inventoryExportCsvMutation({ type: "INVENTORY" }, ctx);

    const parsedData = papaparse.parse(result);

    expect(parsedData.data[0]).toEqual([
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
    ]);

    expect(parsedData.data[1]).toEqual([
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
    ]);

    expect(parsedData.data[2]).toEqual([
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
    ]);

    expect(parsedData.data[3]).toEqual([
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
    ]);

    expect(parsedData.data[4]).toEqual([
      "Gear 2",
      "category 1",
      "1000",
      "gram",
      "",
      "",
      "$",
      "",
      "",
      "",
      "",
      "1",
    ]);

    expect(parsedData.data[5]).toEqual([
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
    ]);

    expect(parsedData.data[6]).toEqual([
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
    ]);

    expect(parsedData.data[7]).toEqual([
      "Gear 2",
      "category 2",
      "1000",
      "gram",
      "",
      "",
      "$",
      "",
      "",
      "",
      "",
      "1",
    ]);
  });
});
