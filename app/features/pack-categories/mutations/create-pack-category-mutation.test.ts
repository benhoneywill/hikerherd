import type { User, Pack } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import createPackCategoryMutation from "./create-pack-category-mutation";

let user: User;
let pack: Pack;

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
});

describe("createPackCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      createPackCategoryMutation({ name: "My category", packId: pack.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the pack does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      createPackCategoryMutation({ name: "My category", packId: "abc123" }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the pack does not belong to the user", async () => {
    const otherUser = await db.user.create({
      data: {
        email: "other@hikerherd.com",
        username: "otheruser",
        hashedPassword: "fakehash",
      },
    });

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      createPackCategoryMutation({ name: "My category", packId: pack.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should correctly create a first category", async () => {
    const { ctx } = await createMockContext({ user });

    const category = await createPackCategoryMutation(
      { name: "My category", packId: pack.id },
      ctx
    );

    expect(category?.index).toEqual(0);
  });

  it("should create subsequent categories with the correct index", async () => {
    const { ctx } = await createMockContext({ user });

    await db.packCategory.createMany({
      data: [
        { name: "0", packId: pack.id, index: 0 },
        { name: "1", packId: pack.id, index: 1 },
        { name: "2", packId: pack.id, index: 2 },
      ],
    });

    const category = await createPackCategoryMutation(
      { name: "3", packId: pack.id },
      ctx
    );

    expect(category?.index).toEqual(3);
  });
});
