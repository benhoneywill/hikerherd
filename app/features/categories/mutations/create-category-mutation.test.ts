import type { User } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import createCategoryMutation from "./create-category-mutation";

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

describe("createCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      createCategoryMutation({ name: "My category", type: "INVENTORY" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("It should correctly create a first category", async () => {
    const { ctx } = await createMockContext({ user });

    const category = await createCategoryMutation(
      { name: "My category", type: "INVENTORY" },
      ctx
    );

    expect(category?.index).toEqual(0);
  });

  it("It should create subsequent categories with the correct index", async () => {
    const { ctx } = await createMockContext({ user });

    await db.category.createMany({
      data: [
        { name: "0", type: "INVENTORY", index: 0, userId: user.id },
        { name: "1", type: "INVENTORY", index: 1, userId: user.id },
        { name: "2", type: "INVENTORY", index: 2, userId: user.id },
      ],
    });

    const category = await createCategoryMutation(
      { name: "3", type: "INVENTORY" },
      ctx
    );

    expect(category?.index).toEqual(3);
  });

  it("It track different types with different indexes", async () => {
    const { ctx } = await createMockContext({ user });

    await db.category.createMany({
      data: [
        { name: "0", type: "INVENTORY", index: 0, userId: user.id },
        { name: "1", type: "INVENTORY", index: 1, userId: user.id },
      ],
    });

    await db.category.createMany({
      data: [
        { name: "0", type: "WISH_LIST", index: 0, userId: user.id },
        { name: "1", type: "WISH_LIST", index: 1, userId: user.id },
        { name: "2", type: "WISH_LIST", index: 2, userId: user.id },
      ],
    });

    const inventoryCategory = await createCategoryMutation(
      { name: "inventory", type: "INVENTORY" },
      ctx
    );

    const wishListCategory = await createCategoryMutation(
      { name: "wishlist", type: "WISH_LIST" },
      ctx
    );

    expect(inventoryCategory?.index).toEqual(2);
    expect(wishListCategory?.index).toEqual(3);
  });
});
