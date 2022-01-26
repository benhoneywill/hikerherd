import type { User } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import deleteCategoryMutation from "./delete-category-mutation";

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

describe("deleteCategoryMutation", () => {
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
      deleteCategoryMutation({ id: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(deleteCategoryMutation({ id: "abc123" }, ctx)).rejects.toThrow(
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

    await expect(
      deleteCategoryMutation({ id: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should should delete the category", async () => {
    const { ctx } = await createMockContext({ user });

    const category = await db.category.create({
      data: {
        name: "My category",
        index: 0,
        type: "INVENTORY",
        userId: user.id,
      },
    });

    await deleteCategoryMutation({ id: category.id }, ctx);

    const fetchedCategory = await db.category.findUnique({
      where: { id: category.id },
    });

    await expect(fetchedCategory).toEqual(null);
  });

  it("should change the indexes of the categories correctly", async () => {
    const { ctx } = await createMockContext({ user });

    await db.category.createMany({
      data: [
        { name: "wl0", type: "WISH_LIST", index: 0, userId: user.id },
        { name: "wl1", type: "WISH_LIST", index: 1, userId: user.id },
        { name: "wl2", type: "WISH_LIST", index: 2, userId: user.id },
        { name: "wl3", type: "WISH_LIST", index: 3, userId: user.id },

        { name: "inv0", type: "INVENTORY", index: 0, userId: user.id },
        { name: "inv1", type: "INVENTORY", index: 1, userId: user.id },
        { name: "inv2", type: "INVENTORY", index: 2, userId: user.id },
        { name: "inv3", type: "INVENTORY", index: 3, userId: user.id },
      ],
    });

    const wl2 = await db.category.findFirst({ where: { name: "wl2" } });

    await deleteCategoryMutation({ id: wl2?.id as string }, ctx);

    const wl0 = await db.category.findFirst({ where: { name: "wl0" } });
    const wl1 = await db.category.findFirst({ where: { name: "wl1" } });
    const wl3 = await db.category.findFirst({ where: { name: "wl3" } });

    expect(wl0?.index).toEqual(0);
    expect(wl1?.index).toEqual(1);
    expect(wl3?.index).toEqual(2);

    const inv3 = await db.category.findFirst({ where: { name: "inv3" } });
    expect(inv3?.index).toEqual(3);

    await deleteCategoryMutation({ id: inv3?.id as string }, ctx);

    const inv1 = await db.category.findFirst({ where: { name: "inv1" } });
    expect(inv1?.index).toEqual(1);

    await deleteCategoryMutation({ id: inv1?.id as string }, ctx);

    const inv2 = await db.category.findFirst({ where: { name: "inv2" } });
    expect(inv2?.index).toEqual(1);
  });
});
