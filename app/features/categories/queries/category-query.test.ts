import type { User } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import categoryQuery from "./category-query";

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

describe("categoryQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    const category = await db.category.create({
      data: {
        name: "My category",
        index: 0,
        type: "INVENTORY",
        userId: user.id,
      },
    });

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
    const { ctx } = await createMockContext({ user });

    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    const category = await db.category.create({
      data: {
        name: "My category",
        index: 0,
        type: "INVENTORY",
        userId: otherUser.id,
      },
    });

    await expect(categoryQuery({ id: category.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("Should return the category", async () => {
    const { ctx } = await createMockContext({ user });

    const category = await db.category.create({
      data: {
        name: "My category",
        index: 0,
        type: "INVENTORY",
        userId: user.id,
      },
    });

    const result = await categoryQuery({ id: category.id }, ctx);

    expect(result).toMatchObject({
      id: category.id,
      name: "My category",
      index: 0,
      userId: user.id,
    });
  });
});
