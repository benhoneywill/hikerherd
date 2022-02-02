import type { User, PackCategory, CategoryItem, Pack } from "db";

import { NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import packOrganizerQuery from "./pack-organizer-query";

let user: User;
let pack: Pack;
let category: PackCategory;
let item: CategoryItem;

const GEAR_VALUES = {
  name: "My gear",
  weight: 100,
  imageUrl: "https://example.com/example.png",
  link: "https://example.com/",
  notes: "Nice gear, use it a lot",
  consumable: false,
  price: 10000,
  currency: "GBP",
} as const;

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
      name: "My Pack",
      slug: "my-pack",
      notes: null,
      userId: user.id,
    },
  });

  category = await db.packCategory.create({
    data: {
      name: "Category",
      index: 0,
      packId: pack.id,
    },
  });

  item = await db.packCategoryItem.create({
    data: {
      index: 0,
      worn: false,
      category: {
        connect: {
          id: category.id,
        },
      },
      gear: {
        create: {
          ...GEAR_VALUES,
          userId: user.id,
        },
      },
    },
  });
});

describe("packOrganizerQuery", () => {
  it("should error if the pack is not found", async () => {
    const { ctx } = await createMockContext();

    await expect(packOrganizerQuery({ id: "abc123" }, ctx)).rejects.toThrow(
      NotFoundError
    );
  });

  it("Should return the pack", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await packOrganizerQuery({ id: pack.id }, ctx);

    expect(result[0]?.name).toEqual(category.name);
    expect(result[0]?.items[0]?.id).toEqual(item.id);
  });
});
