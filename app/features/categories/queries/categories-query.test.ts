import type { User } from "db";

import { AuthenticationError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createCategory from "test/helpers/create-category";

import categoriesQuery from "./categories-query";

let user: User;

beforeEach(async () => {
  user = await createUser();
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

    const otherUser = await createUser();

    await createCategory({ userId: user.id, index: 0 });
    await createCategory({ userId: user.id, index: 1 });
    await createCategory({ userId: user.id, index: 2 });
    await createCategory({ userId: user.id, type: "WISH_LIST", index: 0 });
    await createCategory({ userId: user.id, type: "WISH_LIST", index: 1 });

    await createCategory({ userId: otherUser.id, index: 0 });
    await createCategory({ userId: otherUser.id, index: 1 });

    const wishListCategories = await categoriesQuery(
      { type: "WISH_LIST" },
      ctx
    );

    expect(wishListCategories.length).toEqual(2);
    expect(wishListCategories[0]?.index).toEqual(0);
    expect(wishListCategories[1]?.index).toEqual(1);

    const inventoryCategories = await categoriesQuery(
      { type: "INVENTORY" },
      ctx
    );

    expect(inventoryCategories.length).toEqual(3);
    expect(inventoryCategories[0]?.index).toEqual(0);
    expect(inventoryCategories[1]?.index).toEqual(1);
    expect(inventoryCategories[2]?.index).toEqual(2);
  });
});
