import type { User, Category, CategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import moveCategoryGearMutation from "./move-category-gear-mutation";

let user: User;
let category1: Category;
let category2: Category;
let item1: CategoryItem;
let item2: CategoryItem;

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

  category1 = await db.category.create({
    data: {
      name: "Category 1",
      index: 0,
      type: "INVENTORY",
      userId: user.id,
    },
  });

  category2 = await db.category.create({
    data: {
      name: "Category 2",
      index: 0,
      type: "INVENTORY",
      userId: user.id,
    },
  });

  item1 = await db.categoryItem.create({
    data: {
      index: 0,
      category: {
        connect: {
          id: category1.id,
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

  item2 = await db.categoryItem.create({
    data: {
      index: 0,
      category: {
        connect: {
          id: category2.id,
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

describe("moveCategoryGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      moveCategoryGearMutation(
        { id: item1.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      moveCategoryGearMutation(
        { id: "abc123", categoryId: category2.id, index: 0 },
        ctx
      )
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
      moveCategoryGearMutation(
        { id: item1.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should error if the destination category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      moveCategoryGearMutation(
        { id: item1.id, categoryId: "abc123", index: 0 },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the destination category does not belong to the user", async () => {
    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      moveCategoryGearMutation(
        { id: item1.id, categoryId: category2.id, index: 0 },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should update the category and indexes of items correctly", async () => {
    const { ctx } = await createMockContext({ user });

    await moveCategoryGearMutation(
      { id: item1.id, categoryId: category2.id, index: 0 },
      ctx
    );

    const fetchedItem1 = await db.categoryItem.findUnique({
      where: { id: item1.id },
    });
    const fetchedItem2 = await db.categoryItem.findUnique({
      where: { id: item2.id },
    });

    expect(fetchedItem1?.categoryId).toEqual(category2.id);
    expect(fetchedItem1?.index).toEqual(0);
    expect(fetchedItem2?.index).toEqual(1);
  });
});
