import type { User, Category, CategoryItem } from "db";

import { AuthenticationError, AuthorizationError, NotFoundError } from "blitz";

import faker from "@faker-js/faker";

import createMockContext from "test/helpers/create-mock-context";
import createUser from "test/helpers/create-user";
import createCategory from "test/helpers/create-category";
import createGear from "test/helpers/create-gear";
import createCategoryItem from "test/helpers/create-category-item";
import createPack from "test/helpers/create-pack";
import createPackCategory from "test/helpers/create-pack-category";
import createPackCategoryItem from "test/helpers/create-pack-category-item";

import db from "db";

import deleteCategoryGearMutation from "./delete-category-gear-mutation";

let user: User;
let category: Category;
let item: CategoryItem;

beforeEach(async () => {
  user = await createUser();
  category = await createCategory({ userId: user.id });
  const gear = await createGear({ userId: user.id });
  item = await createCategoryItem({ categoryId: category.id, gearId: gear.id });
});

describe("deleteCategoryGearMutation", () => {
  it("should error if not logged in", async () => {
    const { ctx } = await createMockContext();

    await expect(
      deleteCategoryGearMutation({ id: item.id }, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  it("should error if the item does not exist", async () => {
    const { ctx } = await createMockContext({ user });

    await expect(
      deleteCategoryGearMutation({ id: faker.datatype.uuid() }, ctx)
    ).rejects.toThrow(NotFoundError);
  });

  it("should error if the item does not belong to the user", async () => {
    const otherUser = await createUser();
    const { ctx } = await createMockContext({ user: otherUser });

    await expect(
      deleteCategoryGearMutation({ id: item.id }, ctx)
    ).rejects.toThrow(AuthorizationError);
  });

  it("should delete the item", async () => {
    const { ctx } = await createMockContext({ user });

    await deleteCategoryGearMutation({ id: item.id }, ctx);

    const fetchedItem = await db.categoryItem.findUnique({
      where: { id: item.id },
    });

    await expect(fetchedItem).toEqual(null);
  });

  it("should change the indexes of the other items correctly", async () => {
    const { ctx } = await createMockContext({ user });

    const gear2 = await createGear({ userId: user.id });
    const item2 = await createCategoryItem({
      index: 1,
      categoryId: category.id,
      gearId: gear2.id,
    });

    const gear3 = await createGear({ userId: user.id });
    const item3 = await createCategoryItem({
      index: 2,
      categoryId: category.id,
      gearId: gear3.id,
    });

    await deleteCategoryGearMutation({ id: item2.id }, ctx);

    const fetchedItem1 = await db.categoryItem.findUnique({
      where: { id: item.id },
    });
    const fetchedItem3 = await db.categoryItem.findUnique({
      where: { id: item3.id },
    });

    expect(fetchedItem1?.index).toEqual(0);
    expect(fetchedItem3?.index).toEqual(1);
  });

  it("should delete the associated gear if there are no clones or pack items", async () => {
    const { ctx } = await createMockContext({ user });

    await deleteCategoryGearMutation({ id: item.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear).toEqual(null);
  });

  it("should not delete the associated gear if there are clones", async () => {
    const { ctx } = await createMockContext({ user });

    await createGear({ userId: user.id, clonedFromId: item.gearId });

    await deleteCategoryGearMutation({ id: item.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });

  it("should not delete the associated gear if there are pack items", async () => {
    const { ctx } = await createMockContext({ user });

    const pack = await createPack({ userId: user.id });
    const packCategory = await createPackCategory({ packId: pack.id });
    await createPackCategoryItem({
      categoryId: packCategory.id,
      gearId: item.gearId,
    });

    await deleteCategoryGearMutation({ id: item.id }, ctx);

    const gear = await db.gear.findUnique({ where: { id: item.gearId } });

    expect(gear?.id).toEqual(item.gearId);
  });
});
