import type { User, Category } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createCategory from "test/factories/create-category";

import categoryQuery from "./category-query";

let user: User;
let category: Category;

beforeEach(async () => {
  user = await createUser({});
  category = await createCategory({ userId: user.id });
});

describe("categoryQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(categoryQuery({ id: category.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(categoryQuery({ id: "abc123" }, ctx)).rejects.toThrow(
      NotFoundError
    );
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser({});
    const { ctx } = await createMockContext({ user: otherUser });

    await expect(categoryQuery({ id: category.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("Should return the category", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await categoryQuery({ id: category.id }, ctx);

    expect(result).toMatchObject({
      id: category.id,
      name: category.name,
      index: category.index,
      userId: user.id,
    });
  });
});
