import type { User, Category, CategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import updateCategoryGearMutation from "./update-category-gear-mutation";

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

describe("updateCategoryGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updateCategoryGearMutation({ id: item.id, ...GEAR_VALUES }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updateCategoryGearMutation({ id: "abc123", ...GEAR_VALUES }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      updateCategoryGearMutation({ id: item.id, ...GEAR_VALUES }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the item", async () => {
    const { ctx } = await createMockContext({ user });

    await updateCategoryGearMutation(
      { id: item.id, ...GEAR_VALUES, name: "updated" },
      ctx
    );

    const fetchedItem = await db.categoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetchedItem?.gear.name).toEqual("updated");
  });
});
