import type { User, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import papaparse from "papaparse";

import createMockContext from "test/create-mock-context";

import db from "db";

import packImportCsvMutation from "./pack-import-csv-mutation";

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
let pack: Pack;

beforeEach(async () => {
  user = await db.user.create({
    data: {
      email: "example@hikerherd.com",
      username: "testuser",
      hashedPassword: "fakehash",
    },
  });

  pack = await db.pack.create({
    data: {
      userId: user.id,
      name: "my pack",
      slug: "my-pack",
    },
  });
});

describe("packImportCsvMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      packImportCsvMutation({ id: pack.id, file: "" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the pack is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      packImportCsvMutation({ id: "abc123", file: "" }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the pack does not belong to the user", async () => {
    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      packImportCsvMutation({ id: pack.id, file: "" }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should create the correct database records", async () => {
    const { ctx } = await createMockContext({ user });

    await packImportCsvMutation({ id: pack.id, file: createCsv() }, ctx);

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

    const category0 = await db.packCategory.findFirst({
      where: { name: "category 0" },
      include: {
        items: { include: { gear: true }, orderBy: { index: "asc" } },
      },
    });

    expect(category0?.index).toEqual(0);
    expect(category0?.items.length).toEqual(2);
    expect(category0?.items[0]?.gear).toMatchObject(gear0);
    expect(category0?.items[1]?.gear).toMatchObject(gear1);

    const category1 = await db.packCategory.findFirst({
      where: { name: "category 1" },
      include: {
        items: { include: { gear: true }, orderBy: { index: "asc" } },
      },
    });

    expect(category1?.index).toEqual(1);
    expect(category1?.items.length).toEqual(2);
    expect(category1?.items[0]?.gear).toMatchObject(gear0);
    expect(category1?.items[1]?.gear).toMatchObject(gear2);

    const category2 = await db.packCategory.findFirst({
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

    await db.packCategory.create({
      data: {
        name: "category 0",
        index: 0,
        packId: pack.id,
        items: {
          create: {
            index: 0,
            worn: false,
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

    await packImportCsvMutation({ id: pack.id, file: createCsv() }, ctx);

    const categoryCount = await db.packCategory.findFirst({
      select: { _count: true },
    });

    expect(categoryCount?._count?.items).toEqual(3);

    const category0 = await db.packCategory.findFirst({
      where: { name: "category 0" },
      include: {
        items: { include: { gear: true }, orderBy: { index: "asc" } },
      },
    });

    expect(category0?.index).toEqual(0);
    expect(category0?.items.length).toEqual(3);
  });
});
