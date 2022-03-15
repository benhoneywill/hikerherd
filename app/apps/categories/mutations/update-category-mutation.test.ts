import type { User, Category } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createCategory from "test/factories/create-category";

import db from "db";

import updateCategoryMutation from "./update-category-mutation";

let user: User;
let category: Category;

beforeEach(async () => {
  user = await createUser({});
  category = await createCategory({ userId: user.id });
});

describe("updateCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      updateCategoryMutation(
        { id: category.id, name: faker.random.word() },
        ctx
      )
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updateCategoryMutation(
        { id: faker.datatype.uuid(), name: faker.random.word() },
        ctx
      )
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser({});
    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      updateCategoryMutation(
        { id: category.id, name: faker.random.word() },
        ctx
      )
    ).rejects.toThrow(AuthorizationError);
  });

  it("Should correctly update the category name", async () => {
    const { ctx } = await createMockContext({ user });

    const newName = faker.random.word();

    await updateCategoryMutation({ id: category.id, name: newName }, ctx);

    const updated = await db.category.findUnique({
      where: { id: category.id },
    });

    expect(updated?.name).toEqual(newName);
  });
});
