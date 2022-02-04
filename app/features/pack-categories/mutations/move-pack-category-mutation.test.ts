import type { User, Pack, PackCategory } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import movePackCategoryMutation from "./move-pack-category-mutation";

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

describe("movePackCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      movePackCategoryMutation({ id: category.id, index: 0 }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      movePackCategoryMutation({ id: "abc123", index: 0 }, ctx)
    ).rejects.toThrow(NotFoundError);
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

    await expect(
      movePackCategoryMutation({ id: category.id, index: 0 }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("Should correctly update the indexes of all categories", async () => {
    const { ctx } = await createMockContext({ user });

    await db.packCategory.createMany({
      data: [
        { name: "cat0", packId: pack.id, index: 0 },
        { name: "cat1", packId: pack.id, index: 1 },
        { name: "cat2", packId: pack.id, index: 2 },
        { name: "cat3", packId: pack.id, index: 3 },
      ],
    });

    const moveCat = await db.packCategory.findFirst({
      where: { name: "cat2" },
    });

    await movePackCategoryMutation(
      { id: moveCat?.id as string, index: 0 },
      ctx
    );

    const cat0 = await db.packCategory.findFirst({ where: { name: "cat0" } });
    const cat1 = await db.packCategory.findFirst({ where: { name: "cat1" } });
    const cat2 = await db.packCategory.findFirst({ where: { name: "cat2" } });
    const cat3 = await db.packCategory.findFirst({ where: { name: "cat3" } });

    expect(cat0?.index).toEqual(1);
    expect(cat1?.index).toEqual(2);
    expect(cat2?.index).toEqual(0);
    expect(cat3?.index).toEqual(3);
  });
});
