import type { User, Pack, PackCategory } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import packCategoryQuery from "./pack-category-query";

let user: User;
let pack: Pack;
let category: PackCategory;

beforeEach(async () => {
  user = await db.user.create({
    data: {
      email: "example@hikerherd.com",
      username: "testuser",
      hashedPassword: "fakehash",
    },
  });

  pack = await db.pack.create({
    data: {
      name: "My Pack",
      slug: "my-pack",
      userId: user.id,
      notes: null,
    },
  });

  category = await db.packCategory.create({
    data: {
      name: "My category",
      index: 0,
      packId: pack.id,
    },
  });
});

describe("packCategoryQuery", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(packCategoryQuery({ id: category.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(packCategoryQuery({ id: "abc123" }, ctx)).rejects.toThrow(
      NotFoundError
    );
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await db.user.create({
      data: {
        email: "example2@hikerherd.com",
        username: "testuser2",
        hashedPassword: "fakehash",
      },
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(packCategoryQuery({ id: category.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("Should return the category", async () => {
    const { ctx } = await createMockContext({ user });

    const result = await packCategoryQuery({ id: category.id }, ctx);

    expect(result).toMatchObject({
      id: category.id,
      name: "My category",
    });
  });
});
