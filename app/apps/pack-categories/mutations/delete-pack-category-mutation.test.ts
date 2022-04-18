import type { User, Pack, PackCategory } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createPackCategoryItem from "test/factories/create-pack-category-item";
import createGear from "test/factories/create-gear";
import createCategory from "test/factories/create-category";
import createCategoryItem from "test/factories/create-category-item";

import db from "db";

import deletePackCategoryMutation from "./delete-pack-category-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });
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
      deletePackCategoryMutation({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the category does not belong to the user", async () => {
    const otherUser = await createUser({});

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

    const cat1 = await createPackCategory({ packId: pack.id, index: 1 });
    const cat2 = await createPackCategory({ packId: pack.id, index: 2 });
    const cat3 = await createPackCategory({ packId: pack.id, index: 3 });

    await deletePackCategoryMutation({ id: cat1.id }, ctx);

    const fetched0 = await db.packCategory.findUnique({
      where: { id: category.id },
    });
    const fetched2 = await db.packCategory.findUnique({
      where: { id: cat2.id },
    });
    const fetched3 = await db.packCategory.findUnique({
      where: { id: cat3.id },
    });

    expect(fetched0?.index).toEqual(0);
    expect(fetched2?.index).toEqual(1);
    expect(fetched3?.index).toEqual(2);
  });

  it("should delete the category items", async () => {
    const { ctx } = await createMockContext({ user });

    const gear1 = await createGear({ userId: user.id });
    const gear2 = await createGear({ userId: user.id });

    const item1 = await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear1.id,
    });
    const item2 = await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear2.id,
    });

    await deletePackCategoryMutation({ id: category.id }, ctx);

    const fetchedItem1 = await db.packCategoryItem.findUnique({
      where: { id: item1.id },
    });
    const fetchedItem2 = await db.packCategoryItem.findUnique({
      where: { id: item2.id },
    });

    expect(fetchedItem1).toEqual(null);
    expect(fetchedItem2).toEqual(null);
  });

  it("should delete the gear associated with the category items", async () => {
    const { ctx } = await createMockContext({ user });

    const gear1 = await createGear({ userId: user.id });
    const gear2 = await createGear({ userId: user.id });

    const item1 = await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear1.id,
    });
    const item2 = await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear2.id,
    });

    await deletePackCategoryMutation({ id: category.id }, ctx);

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

    const item1 = await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear1.id,
    });
    const item2 = await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear2.id,
    });

    await deletePackCategoryMutation({ id: category.id }, ctx);

    const fetchedGear1 = await db.gear.findUnique({
      where: { id: item1.gearId },
    });
    const fetchedGear2 = await db.gear.findUnique({
      where: { id: item2.gearId },
    });

    expect(fetchedGear1?.id).toEqual(gear1Clone.clonedFromId);
    expect(fetchedGear2).toEqual(null);
  });

  it("should not delete the associated gear if there are inventory items", async () => {
    const { ctx } = await createMockContext({ user });

    const gear1 = await createGear({ userId: user.id });
    const gear2 = await createGear({ userId: user.id });

    const item1 = await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear1.id,
    });
    const item2 = await createPackCategoryItem({
      categoryId: category.id,
      gearId: gear2.id,
    });

    const invCategory = await createCategory({ userId: user.id });
    const invItem = await createCategoryItem({
      categoryId: invCategory.id,
      gearId: item1.gearId,
    });

    await deletePackCategoryMutation({ id: category.id }, ctx);

    const fetchedGear1 = await db.gear.findUnique({
      where: { id: item1.gearId },
    });
    const fetchedGear2 = await db.gear.findUnique({
      where: { id: item2.gearId },
    });

    expect(fetchedGear1?.id).toEqual(invItem.gearId);
    expect(fetchedGear2).toEqual(null);
  });
});
