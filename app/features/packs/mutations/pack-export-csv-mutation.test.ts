import type { User, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import papaparse from "papaparse";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";

import db from "db";

import packExportCsvMutation from "./pack-export-csv-mutation";

let user: User;
let pack: Pack;

beforeEach(async () => {
  user = await createUser();

  pack = await db.pack.create({
    data: {
      userId: user.id,
      name: "my pack",
      slug: "my-pack",
    },
  });
});

describe("packExportCsvMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(packExportCsvMutation({ id: pack.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the pack does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(packExportCsvMutation({ id: "abc123" }, ctx)).rejects.toThrow(
      NotFoundError
    );
  });

  it("should error if the pack does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(packExportCsvMutation({ id: pack.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("should return the correct CSV", async () => {
    const { ctx } = await createMockContext({ user });

    const category0 = await db.packCategory.create({
      data: {
        name: "category 0",
        index: 0,
        packId: pack.id,
      },
    });

    const category1 = await db.packCategory.create({
      data: {
        name: "category 1",
        index: 1,
        packId: pack.id,
      },
    });

    const category2 = await db.packCategory.create({
      data: {
        name: "category 2",
        index: 2,
        packId: pack.id,
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

    await db.packCategoryItem.createMany({
      data: [
        {
          index: 0,
          gearId: gear0.id,
          categoryId: category0.id,
          worn: true,
        },
        {
          index: 1,
          gearId: gear1.id,
          categoryId: category0.id,
          worn: false,
        },
        {
          index: 0,
          gearId: gear0.id,
          categoryId: category1.id,
          worn: false,
        },
        {
          index: 1,
          gearId: gear2.id,
          categoryId: category1.id,
          worn: false,
        },
        {
          index: 0,
          gearId: gear0.id,
          categoryId: category2.id,
          worn: false,
        },
        {
          index: 1,
          gearId: gear1.id,
          categoryId: category2.id,
          worn: false,
        },
        {
          index: 2,
          gearId: gear2.id,
          categoryId: category2.id,
          worn: false,
        },
      ],
    });

    const result = await packExportCsvMutation({ id: pack.id }, ctx);

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
      "worn",
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
