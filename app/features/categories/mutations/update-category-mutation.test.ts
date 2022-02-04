import type { User } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import updateCategoryMutation from "./update-category-mutation";

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

describe("updateCategoryMutation", () => {
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

    await expect(
      updateCategoryMutation({ id: category.id, name: "updated" }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      updateCategoryMutation({ id: "abc123", name: "updated" }, ctx)
    ).rejects.toThrow(NotFoundError);
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

    await expect(
      updateCategoryMutation({ id: category.id, name: "updated" }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("Should correctly update the category name", async () => {
    const { ctx } = await createMockContext({ user });

    const category = await db.category.create({
      data: {
        name: "My category",
        index: 0,
        type: "INVENTORY",
        userId: user.id,
      },
    });

    await updateCategoryMutation({ id: category.id, name: "updated" }, ctx);

    const updated = await db.category.findUnique({
      where: { id: category.id },
    });

    expect(updated?.name).toEqual("updated");
  });
});
