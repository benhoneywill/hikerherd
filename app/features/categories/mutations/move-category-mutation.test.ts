import type { User } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import createMockContext from "test/create-mock-context";

import db from "db";

import moveCategoryMutation from "./move-category-mutation";

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

describe("moveCategoryMutation", () => {
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
      moveCategoryMutation({ id: category.id, index: 0 }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      moveCategoryMutation({ id: "abc123", index: 0 }, ctx)
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
      moveCategoryMutation({ id: category.id, index: 0 }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("Should correctly update the indexes of all categories", async () => {
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

    const moveWl = await db.category.findFirst({ where: { name: "wl2" } });

    await moveCategoryMutation({ id: moveWl?.id as string, index: 0 }, ctx);

    const wl0 = await db.category.findFirst({ where: { name: "wl0" } });
    const wl1 = await db.category.findFirst({ where: { name: "wl1" } });
    const wl2 = await db.category.findFirst({ where: { name: "wl2" } });
    const wl3 = await db.category.findFirst({ where: { name: "wl3" } });

    expect(wl0?.index).toEqual(1);
    expect(wl1?.index).toEqual(2);
    expect(wl2?.index).toEqual(0);
    expect(wl3?.index).toEqual(3);

    const moveInv = await db.category.findFirst({ where: { name: "inv0" } });

    expect(moveInv?.index).toEqual(0);

    await moveCategoryMutation({ id: moveInv?.id as string, index: 2 }, ctx);

    const inv0 = await db.category.findFirst({ where: { name: "inv0" } });
    const inv1 = await db.category.findFirst({ where: { name: "inv1" } });
    const inv2 = await db.category.findFirst({ where: { name: "inv2" } });
    const inv3 = await db.category.findFirst({ where: { name: "inv3" } });

    expect(inv0?.index).toEqual(2);
    expect(inv1?.index).toEqual(0);
    expect(inv2?.index).toEqual(1);
    expect(inv3?.index).toEqual(3);
  });
});
