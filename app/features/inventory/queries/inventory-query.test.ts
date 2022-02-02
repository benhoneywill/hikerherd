import type { User, Category, CategoryItem } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import inventoryQuery from "./inventory-query";

let user: User;
let category: Category;
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

  category = await db.category.create({
    data: {
      name: "Category",
      index: 0,
      type: "INVENTORY",
      userId: user.id,
    },
  });

  item = await db.categoryItem.create({
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
});

describe("inventoryQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(inventoryQuery({ type: "INVENTORY" }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("Should return the inventory", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await inventoryQuery({ type: "INVENTORY" }, ctx);

    expect(result[0]?.name).toEqual(category.name);
    expect(result[0]?.items[0]?.id).toEqual(item.id);
  });
});
