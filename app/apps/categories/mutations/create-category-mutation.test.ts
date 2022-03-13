import type { User } from "db";

import { AuthenticationError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createCategory from "test/helpers/create-category";

import createCategoryMutation from "./create-category-mutation";

let user: User;

beforeEach(async () => {
  user = await createUser();
});

describe("createCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      createCategoryMutation(
        { name: faker.random.word(), type: "INVENTORY" },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should correctly create a first category", async () => {
    const { ctx } = await createMockContext({ user });

    const category = await createCategoryMutation(
      { name: faker.random.word(), type: "INVENTORY" },
      ctx
    );

    expect(category?.index).toEqual(0);
  });

  it("should create subsequent categories with the correct index", async () => {
    const { ctx } = await createMockContext({ user });

    await createCategory({ userId: user.id, index: 0 });
    await createCategory({ userId: user.id, index: 1 });

    const category = await createCategoryMutation(
      { name: faker.random.word(), type: "INVENTORY" },
      ctx
    );

    expect(category?.index).toEqual(2);
  });

  it("should track different types with different indexes", async () => {
    const { ctx } = await createMockContext({ user });

    await createCategory({ userId: user.id, index: 0 });

    await createCategory({ userId: user.id, index: 0, type: "WISH_LIST" });
    await createCategory({ userId: user.id, index: 1, type: "WISH_LIST" });

    const inventoryCategory = await createCategoryMutation(
      { name: faker.random.word(), type: "INVENTORY" },
      ctx
    );

    const wishListCategory = await createCategoryMutation(
      { name: faker.random.word(), type: "WISH_LIST" },
      ctx
    );

    expect(inventoryCategory?.index).toEqual(1);
    expect(wishListCategory?.index).toEqual(2);
  });
});
