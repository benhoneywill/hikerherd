import type { User, Pack, PackCategory, PackCategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/factories/create-user";
import createPack from "test/factories/create-pack";
import createPackCategory from "test/factories/create-pack-category";
import createGear from "test/factories/create-gear";
import createPackCategoryItem from "test/factories/create-pack-category-item";
import createCategory from "test/factories/create-category";
import createCategoryItem from "test/factories/create-category-item";

import db from "db";

import deletePackGearMutation from "./delete-pack-gear-mutation";

let user: User;
let pack: Pack;
let category: PackCategory;
let item: PackCategoryItem;

beforeEach(async () => {
  user = await createUser({});
  pack = await createPack({ userId: user.id });
  category = await createPackCategory({ packId: pack.id });
  const gear = await createGear({ userId: user.id });
  item = await createPackCategoryItem({
    categoryId: category.id,
    gearId: gear.id,
  });
});

describe("deletePackGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(deletePackGearMutation({ id: item.id }, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      deletePackGearMutation({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser({});

    const { ctx } = await createMockContext({ user: otherUser });

    await expect(deletePackGearMutation({ id: item.id }, ctx)).rejects.toThrow(
      AuthorizationError
    );
  });

  it("should delete the item", async () => {
    const { ctx } = await createMockContext({ user });

    await deletePackGearMutation({ id: item.id }, ctx);

    const fetchedItem = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });

    await expect(fetchedItem).toEqual(null);
  });

  it("should change the indexes of the other items correctly", async () => {
    const { ctx } = await createMockContext({ user });

    const gear2 = await createGear({ userId: user.id });
    const item2 = await createPackCategoryItem({
      index: 1,
      categoryId: category.id,
      gearId: gear2.id,
    });

    const gear3 = await createGear({ userId: user.id });
    const item3 = await createPackCategoryItem({
      index: 2,
      categoryId: category.id,
      gearId: gear3.id,
    });

    await deletePackGearMutation({ id: item2.id }, ctx);

    const fetchedItem1 = await db.packCategoryItem.findUnique({
      where: { id: item.id },
    });
    const fetchedItem3 = await db.packCategoryItem.findUnique({
      where: { id: item3.id },
    });

    expect(fetchedItem1?.index).toEqual(0);
    expect(fetchedItem3?.index).toEqual(1);
  });

  it("should delete the associated gear if there are no clones or inventory items", async () => {
    const { ctx } = await createMockContext({ user });

    await deletePackGearMutation({ id: item.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear).toEqual(null);
  });

  it("should not delete the associated gear if there are clones", async () => {
    const { ctx } = await createMockContext({ user });

    await createGear({ userId: user.id, clonedFromId: item.gearId });

    await deletePackGearMutation({ id: item.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });

  it("should not delete the associated gear if there are inventory items", async () => {
    const { ctx } = await createMockContext({ user });

    const inventoryCategory = await createCategory({ userId: user.id });

    await createCategoryItem({
      categoryId: inventoryCategory.id,
      gearId: item.gearId,
    });

    await deletePackGearMutation({ id: item.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });
});
