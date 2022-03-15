import type { User, Category } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createCategory from "test/factories/create-category";

import db from "db";

import moveCategoryMutation from "./move-category-mutation";

let user: User;
let category: Category;

beforeEach(async () => {
  user = await createUser({});
  category = await createCategory({ userId: user.id });
});

describe("moveCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      moveCategoryMutation({ id: category.id, index: 0 }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      moveCategoryMutation({ id: faker.datatype.uuid(), index: 0 }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser({});
    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      moveCategoryMutation({ id: category.id, index: 0 }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("Should correctly update the indexes of all categories", async () => {
    const { ctx } = await createMockContext({ user });

    const wl0 = await createCategory({
      userId: user.id,
      type: "WISH_LIST",
      index: 0,
    });

    const wl1 = await createCategory({
      userId: user.id,
      type: "WISH_LIST",
      index: 1,
    });

    const wl2 = await createCategory({
      userId: user.id,
      type: "WISH_LIST",
      index: 2,
    });

    const inv0 = await createCategory({
      userId: user.id,
      index: 0,
    });

    const inv1 = await createCategory({
      userId: user.id,
      index: 1,
    });

    const inv2 = await createCategory({
      userId: user.id,
      index: 2,
    });

    await moveCategoryMutation({ id: wl2.id, index: 0 }, ctx);

    const fetchedWl0 = await db.category.findUnique({ where: { id: wl0.id } });
    const fetchedWl1 = await db.category.findUnique({ where: { id: wl1.id } });
    const fetchedWl2 = await db.category.findUnique({ where: { id: wl2.id } });

    expect(fetchedWl0?.index).toEqual(1);
    expect(fetchedWl1?.index).toEqual(2);
    expect(fetchedWl2?.index).toEqual(0);

    const fetchedInv0 = await db.category.findUnique({
      where: { id: inv0.id },
    });

    expect(fetchedInv0?.index).toEqual(0);

    await moveCategoryMutation({ id: inv0.id, index: 1 }, ctx);

    const refetchedInv0 = await db.category.findUnique({
      where: { id: inv0.id },
    });
    const fetchedInv1 = await db.category.findUnique({
      where: { id: inv1.id },
    });
    const fetchedInv2 = await db.category.findUnique({
      where: { id: inv2.id },
    });

    expect(refetchedInv0?.index).toEqual(1);
    expect(fetchedInv1?.index).toEqual(0);
    expect(fetchedInv2?.index).toEqual(2);
  });
});
