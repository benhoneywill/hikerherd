import type { User, Category, Gear } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import addToInventoryMutation from "./add-to-inventory-mutation";

let user: User;
let otherUser: User;
let category: Category;
let gear: Gear;

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

  otherUser = await db.user.create({
    data: {
      email: "other@hikerherd.com",
      username: "otheruser",
      hashedPassword: "fakehash",
    },
  });

  category = await db.category.create({
    data: {
      name: "My category",
      index: 0,
      userId: user.id,
      type: "INVENTORY",
    },
  });

  gear = await db.gear.create({
    data: {
      ...GEAR_VALUES,
      userId: otherUser.id,
    },
  });
});

describe("addToInventoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      addToInventoryMutation({ gearId: gear.id, categoryId: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      addToInventoryMutation({ gearId: gear.id, categoryId: "abc123" }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const { ctx } = await createMockContext({ user });

    const otherCategory = await db.category.create({
      data: {
        name: "My category",
        index: 0,
        userId: otherUser.id,
        type: "INVENTORY",
      },
    });

    await expect(
      addToInventoryMutation(
        { gearId: gear.id, categoryId: otherCategory.id },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("should error if the gear is not found", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      addToInventoryMutation({ gearId: "abc123", categoryId: category.id }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should correctly clone the gear and add it to the category", async () => {
    const { ctx } = await createMockContext({ user });

    const item = await addToInventoryMutation(
      { gearId: gear.id, categoryId: category.id },
      ctx
    );

    const fetched = await db.categoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetched?.index).toEqual(0);
    expect(fetched?.gear).toMatchObject(GEAR_VALUES);
    expect(fetched?.categoryId).toEqual(category.id);
  });

  it("should correctly set the item's index", async () => {
    const { ctx } = await createMockContext({ user });

    await db.categoryItem.create({
      data: {
        categoryId: category.id,
        gearId: gear.id,
        index: 0,
      },
    });

    const item = await addToInventoryMutation(
      { gearId: gear.id, categoryId: category.id },
      ctx
    );

    const fetched = await db.categoryItem.findUnique({
      where: { id: item.id },
      include: { gear: true },
    });

    expect(fetched?.index).toEqual(1);
  });
});
