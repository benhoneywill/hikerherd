import type { User } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import listCategoryGearQuery from "./list-category-gear-query";

let user: User;

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

  const category = await db.category.create({
    data: {
      name: "Category",
      index: 0,
      type: "INVENTORY",
      userId: user.id,
    },
  });

  await db.categoryItem.create({
    data: {
      index: 0,
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

  await db.categoryItem.create({
    data: {
      index: 1,
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

describe("listCategoryGearQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      listCategoryGearQuery({ type: "INVENTORY" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("Should return the correct items", async () => {
    const { ctx } = await createMockContext({ user });

    const inventory = await listCategoryGearQuery({ type: "INVENTORY" }, ctx);

    expect(inventory.length).toEqual(2);

    const wishList = await listCategoryGearQuery({ type: "WISH_LIST" }, ctx);

    expect(wishList.length).toEqual(0);
  });
});
