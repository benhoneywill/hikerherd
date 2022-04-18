import type { User, Category } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createCategory from "test/factories/create-category";
import createGear from "test/factories/create-gear";
import createCategoryItem from "test/factories/create-category-item";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createPackCategoryItem from "test/factories/create-pack-category-item";

import db from "db";

import deleteCategoryMutation from "./delete-category-mutation";

let user: User;
let category: Category;

beforeEach(async () => {
  user = await createUser({});
  category = await createCategory({ userId: user.id });
});

describe("deleteCategoryMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      deleteCategoryMutation({ id: category.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the category does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      deleteCategoryMutation({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      deleteCategoryMutation({ id: category.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should delete the category", async () => {
    const { ctx } = await createMockContext({ user });

    await deleteCategoryMutation({ id: category.id }, ctx);

    const fetchedCategory = await db.category.findUnique({
      where: { id: category.id },
    });

    await expect(fetchedCategory).toEqual(null);
  });

  it("should change the indexes of the categories correctly", async () => {
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

    await deleteCategoryMutation({ id: wl1?.id as string }, ctx);

    const fetchedWl0 = await db.category.findUnique({ where: { id: wl0.id } });
    const fetchedWl2 = await db.category.findUnique({ where: { id: wl2.id } });

    expect(fetchedWl0?.index).toEqual(0);
    expect(fetchedWl2?.index).toEqual(1);

    const fetchedInv1 = await db.category.findUnique({
      where: { id: inv1.id },
    });

    expect(fetchedInv1?.index).toEqual(1);

    await deleteCategoryMutation({ id: inv1.id }, ctx);

    const fetchedInv0 = await db.category.findUnique({
      where: { id: inv0.id },
    });

    const fetchedInv2 = await db.category.findUnique({
      where: { id: inv2.id },
    });

    expect(fetchedInv0?.index).toEqual(0);
    expect(fetchedInv2?.index).toEqual(1);

    await deleteCategoryMutation({ id: inv0.id }, ctx);

    const refetchedInv2 = await db.category.findUnique({
      where: { id: inv2.id },
    });

    expect(refetchedInv2?.index).toEqual(0);
  });

  it("should delete the category items", async () => {
    const { ctx } = await createMockContext({ user });

    const gear1 = await createGear({ userId: user.id });
    const gear2 = await createGear({ userId: user.id });

    const item1 = await createCategoryItem({
      categoryId: category.id,
      gearId: gear1.id,
    });
    const item2 = await createCategoryItem({
      categoryId: category.id,
      gearId: gear2.id,
    });

    await deleteCategoryMutation({ id: category.id }, ctx);

    const fetchedItem1 = await db.categoryItem.findUnique({
      where: { id: item1.id },
    });
    const fetchedItem2 = await db.categoryItem.findUnique({
      where: { id: item2.id },
    });

    expect(fetchedItem1).toEqual(null);
    expect(fetchedItem2).toEqual(null);
  });

  it("should delete the gear associated with the category items", async () => {
    const { ctx } = await createMockContext({ user });

    const gear1 = await createGear({ userId: user.id });
    const gear2 = await createGear({ userId: user.id });

    const item1 = await createCategoryItem({
      categoryId: category.id,
      gearId: gear1.id,
    });
    const item2 = await createCategoryItem({
      categoryId: category.id,
      gearId: gear2.id,
    });

    await deleteCategoryMutation({ id: category.id }, ctx);

    const fetchedGear1 = await db.gear.findUnique({
      where: { id: item1.gearId },
    });
    const fetchedGear2 = await db.gear.findUnique({
      where: { id: item2.gearId },
    });

    expect(fetchedGear1).toEqual(null);
    expect(fetchedGear2).toEqual(null);
  });

  it("should not delete the associated gear if there are clones", async () => {
    const { ctx } = await createMockContext({ user });

    const gear1 = await createGear({ userId: user.id });
    const gear2 = await createGear({ userId: user.id });

    const gear1Clone = await createGear({
      userId: user.id,
      clonedFromId: gear1.id,
    });

    const item1 = await createCategoryItem({
      categoryId: category.id,
      gearId: gear1.id,
    });
    const item2 = await createCategoryItem({
      categoryId: category.id,
      gearId: gear2.id,
    });

    await deleteCategoryMutation({ id: category.id }, ctx);

    const fetchedGear1 = await db.gear.findUnique({
      where: { id: item1.gearId },
    });
    const fetchedGear2 = await db.gear.findUnique({
      where: { id: item2.gearId },
    });

    expect(fetchedGear1?.id).toEqual(gear1Clone.clonedFromId);
    expect(fetchedGear2).toEqual(null);
  });

  it("should not delete the associated gear if there are pack items", async () => {
    const { ctx } = await createMockContext({ user });

    const gear1 = await createGear({ userId: user.id });
    const gear2 = await createGear({ userId: user.id });

    const item1 = await createCategoryItem({
      categoryId: category.id,
      gearId: gear1.id,
    });
    const item2 = await createCategoryItem({
      categoryId: category.id,
      gearId: gear2.id,
    });

    const pack = await createPack({ userId: user.id });
    const packCategory = await createPackCategory({ packId: pack.id });
    const packItem = await createPackCategoryItem({
      categoryId: packCategory.id,
      gearId: item1.gearId,
    });

    await deleteCategoryMutation({ id: category.id }, ctx);

    const fetchedGear1 = await db.gear.findUnique({
      where: { id: item1.gearId },
    });
    const fetchedGear2 = await db.gear.findUnique({
      where: { id: item2.gearId },
    });

    expect(fetchedGear1?.id).toEqual(packItem.gearId);
    expect(fetchedGear2).toEqual(null);
  });
});
