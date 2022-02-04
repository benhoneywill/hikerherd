import type { User } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import categoriesQuery from "./categories-query";

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

describe("categoriesQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(categoriesQuery({ type: "INVENTORY" }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should fetch the current users categories by type", async () => {
    const { ctx } = await createMockContext({ user });

    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    await db.category.createMany({
      data: [
        { name: "wl0", type: "WISH_LIST", index: 0, userId: user.id },
        { name: "wl1", type: "WISH_LIST", index: 1, userId: user.id },
        { name: "wl2", type: "WISH_LIST", index: 2, userId: user.id },

        { name: "inv0", type: "INVENTORY", index: 0, userId: user.id },
        { name: "inv1", type: "INVENTORY", index: 1, userId: user.id },
        { name: "inv2", type: "INVENTORY", index: 2, userId: user.id },
        { name: "inv3", type: "INVENTORY", index: 3, userId: user.id },

        { name: "wl", type: "WISH_LIST", index: 0, userId: otherUser.id },
        { name: "inv", type: "INVENTORY", index: 0, userId: otherUser.id },
      ],
    });

    const wishListCategories = await categoriesQuery(
      { type: "WISH_LIST" },
      ctx
    );

    expect(wishListCategories.length).toEqual(3);
    expect(wishListCategories[0]).toMatchObject({
      name: "wl0",
      index: 0,
      userId: user.id,
    });

    const inventoryCategories = await categoriesQuery(
      { type: "INVENTORY" },
      ctx
    );

    expect(inventoryCategories.length).toEqual(4);
    expect(inventoryCategories[1]).toMatchObject({
      name: "inv1",
      index: 1,
      userId: user.id,
    });
  });
});
