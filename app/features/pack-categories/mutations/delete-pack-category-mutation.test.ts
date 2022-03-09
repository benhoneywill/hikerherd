import type { User, Pack, PackCategory } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";

import db from "db";

import deletePackCategoryMutation from "./delete-pack-category-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;

beforeEach(async () => {
  user = await createUser();

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

describe("deletePackCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      deletePackCategoryMutation({ id: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      deletePackCategoryMutation({ id: "abc123" }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser();

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      deletePackCategoryMutation({ id: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should delete the category", async () => {
    const { ctx } = await createMockContext({ user });

    await deletePackCategoryMutation({ id: category.id }, ctx);

    const fetchedCategory = await db.packCategory.findUnique({
      where: { id: category.id },
    });

    await expect(fetchedCategory).toEqual(null);
  });

  it("should change the indexes of the categories correctly", async () => {
    const { ctx } = await createMockContext({ user });

    await db.packCategory.createMany({
      data: [
        { name: "cat0", packId: pack.id, index: 0 },
        { name: "cat1", packId: pack.id, index: 1 },
        { name: "cat2", packId: pack.id, index: 2 },
        { name: "cat3", packId: pack.id, index: 3 },
      ],
    });

    const cat2 = await db.packCategory.findFirst({ where: { name: "cat2" } });

    await deletePackCategoryMutation({ id: cat2?.id as string }, ctx);

    const cat0 = await db.packCategory.findFirst({ where: { name: "cat0" } });
    const cat1 = await db.packCategory.findFirst({ where: { name: "cat1" } });
    const cat3 = await db.packCategory.findFirst({ where: { name: "cat3" } });

    expect(cat0?.index).toEqual(0);
    expect(cat1?.index).toEqual(1);
    expect(cat3?.index).toEqual(2);
  });
});
